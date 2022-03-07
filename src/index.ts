import { Probot } from 'probot';
import {
  notifyAssignee,
  updateLabelsForAssignedIssue,
  updateLabelsForNewIssue
} from 'src/issue';
import {
  addAdminReviewersToPullRequest,
  addLabelsToNewPullRequest,
  addReviewersToPullRequest,
  checkIfPullRequestIsValid,
  thankPullRequestAuthor
} from 'src/pullRequest';
import { addLabelsToRepo } from 'src/repository';

export = (app: Probot) => {
  app.log.info('Starting Probot');

  app.on('issues.opened', async (context) => {
    await updateLabelsForNewIssue({ app, context });
  });

  app.on('issues.assigned', async (context) => {
    await updateLabelsForAssignedIssue({ app, context });
    await notifyAssignee({ app, context });
  });

  app.on('pull_request.opened', async (context) => {
    if (await checkIfPullRequestIsValid({ app, context })) {
      await addReviewersToPullRequest({ app, context });
      await addLabelsToNewPullRequest({ app, context });
    }
  });

  app.on('pull_request.closed', async (context) => {
    await thankPullRequestAuthor({ app, context });
  });

  app.on('pull_request_review.submitted', async (context) => {
    await addAdminReviewersToPullRequest({ app, context });
  });

  app.on('repository', async (context) => {
    await addLabelsToRepo({ app, context });
  });

  app.onError((event) => {
    app.log.error(event.message);
  });
};
