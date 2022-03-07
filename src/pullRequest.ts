import { EventPayloads, WebhookEvent } from '@octokit/webhooks';
import sampleSize from 'lodash-es/sampleSize';
import { Context, Probot } from 'probot';
import { config } from 'src/config';

export const thankPullRequestAuthor = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadPullRequest> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { pull_request: pullRequest, repository } = context.payload;

  if (pullRequest.merged) {
    try {
      await context.octokit.issues.createComment({
        owner: config.owner,
        repo: repository.name,
        issue_number: pullRequest.number,
        body: config.pullRequestMergedComment.replace(
          /{{author}}/g,
          `@${pullRequest.user.login}`
        )
      });
    } catch (error: any) {
      app.log.error(error);
      return;
    }
  }
};

export const addReviewersToPullRequest = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadPullRequest> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { pull_request: pullRequest, repository } = context.payload;

  const codeReviewers = sampleSize(
    config.members
      .filter((member) =>
        config.responsibilities.roleBased.developers.includes(member.github)
      )
      .filter((reviewer) => reviewer.github !== pullRequest.user.login) // Remove the pull request author from the reviewers list
      .map((reviewer) => reviewer.github),
    config.codeReviewersRequired
  );

  const qaReviewers = sampleSize(
    config.members
      .filter((member) =>
        config.responsibilities.roleBased.qas.includes(member.github)
      )
      .filter((reviewer) => reviewer.github !== pullRequest.user.login) // Remove the pull request author from the reviewers list
      .map((reviewer) => reviewer.github),
    config.qaReviewersRequired
  );

  const potentialReviewers = ['samreetdhillon'];

  // combine all reviewers together and pick unique ones
  const reviewers = [
    ...new Set([...codeReviewers, ...qaReviewers, ...potentialReviewers])
  ];

  const codeReviewersString = codeReviewers
    .map((reviewer) => `@${reviewer}`)
    .join(' ');

  const qaReviewersString = qaReviewers
    .map((reviewer) => `@${reviewer}`)
    .join(' ');

  try {
    await context.octokit.pulls.requestReviewers({
      owner: config.owner,
      pull_number: pullRequest.number,
      repo: repository.name,
      reviewers: reviewers
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }

  try {
    await context.octokit.issues.createComment({
      owner: config.owner,
      repo: repository.name,
      issue_number: pullRequest.number,
      body: config.codeReviewRequestComment.replace(
        /{{reviewers}}/g,
        codeReviewersString
      )
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }

  try {
    await context.octokit.issues.createComment({
      owner: config.owner,
      repo: repository.name,
      issue_number: pullRequest.number,
      body: config.qaReviewRequestComment.replace(
        /{{reviewers}}/g,
        qaReviewersString
      )
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};

export const addLabelsToNewPullRequest = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadPullRequest> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { pull_request: pullRequest, repository } = context.payload;

  const codeReviewLabels = config.labels.filter((label) =>
    ['status:pending code review', 'status:pending qa review'].includes(
      label.name
    )
  );

  try {
    await context.octokit.issues.update({
      owner: config.owner,
      repo: repository.name,
      issue_number: pullRequest.number,
      labels: [...pullRequest.labels, ...codeReviewLabels]
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};

export const addAdminReviewersToPullRequest = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadPullRequestReview> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { pull_request: pullRequest, repository, review } = context.payload;

  if (review.state !== 'approved') {
    return;
  }

  // Stop the operation if there are still some pending code reviewers
  if (pullRequest.requested_reviewers.length > 0) {
    return;
  }

  const codeReviewLabels = [
    'status:pending code review',
    'status:pending qa review'
  ];

  const originalLabelsWithoutCodeReviewLabels = pullRequest.labels.filter(
    (label) => !codeReviewLabels.includes(label.name)
  );

  try {
    await context.octokit.issues.update({
      owner: config.owner,
      repo: repository.name,
      issue_number: pullRequest.number,
      labels: [...originalLabelsWithoutCodeReviewLabels]
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }

  const reviewers = sampleSize(
    config.members
      .filter((member) =>
        config.responsibilities.roleBased.admins.includes(member.github)
      )
      .filter((reviewer) => reviewer.github !== pullRequest.user.login) // Remove the pull request author from the reviewers list
      .map((reviewer) => reviewer.github),
    config.adminReviewersRequired
  );

  const reviewersString = reviewers.map((reviewer) => `@${reviewer}`).join(' ');

  try {
    await context.octokit.issues.createComment({
      owner: config.owner,
      repo: repository.name,
      issue_number: pullRequest.number,
      body: config.adminReviewRequestComment.replace(
        /{{reviewers}}/g,
        reviewersString
      )
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};

// check if pull request can be successfully merged
export const checkIfPullRequestIsValid = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadPullRequest> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { pull_request: pullRequest } = context.payload;

  const isValid = !pullRequest.title.toLowerCase().includes('[wip]');

  return isValid;
};
