import { EventPayloads, WebhookEvent } from '@octokit/webhooks';
import { Context, Probot } from 'probot';
import { config } from 'src/config';

export const updateLabelsForNewIssue = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadIssues> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { issue, repository } = context.payload;

  const newIssueLabel =
    config.labels.find((label) => label.name === 'status:new') ?? {};

  try {
    await context.octokit.issues.update({
      owner: config.owner,
      repo: repository.name,
      issue_number: issue.number,
      labels: [...issue.labels, newIssueLabel]
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};

export const updateLabelsForAssignedIssue = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadIssues> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { issue, repository } = context.payload;

  const newIssueLabel = config.labels.find(
    (label) => label.name === 'status:new'
  );

  const assignedIssueLabel =
    config.labels.find((label) => label.name === 'status:assigned') ?? {};

  const originalLabelsWithoutNewLabel = issue.labels.filter(
    (label) => label.name !== newIssueLabel?.name
  );

  try {
    await context.octokit.issues.update({
      owner: config.owner,
      repo: repository.name,
      issue_number: issue.number,
      labels: [...originalLabelsWithoutNewLabel, assignedIssueLabel]
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};

export const notifyAssignee = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadIssues> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { issue, repository } = context.payload;

  const assigneesString = issue.assignees
    .map((assignee) => `@${assignee.login}`)
    .join(' ');

  try {
    await context.octokit.issues.createComment({
      owner: config.owner,
      repo: repository.name,
      issue_number: issue.number,
      body: config.issueAssignedComment.replace(
        /{{assignees}}/g,
        assigneesString
      )
    });
  } catch (error: any) {
    app.log.error(error);
    return;
  }
};
