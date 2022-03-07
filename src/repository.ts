import { EventPayloads, WebhookEvent } from '@octokit/webhooks';
import { Context, Probot } from 'probot';
import { config } from 'src/config';

// Add or update labels in a repo
export const addLabelsToRepo = async ({
  app,
  context
}: {
  app: Probot;
  context: WebhookEvent<EventPayloads.WebhookPayloadRepository> &
    Omit<Context<any>, keyof WebhookEvent<any>>;
}) => {
  const { repository } = context.payload;

  config.labels.forEach(async (label) => {
    try {
      await context.octokit.issues.createLabel({
        owner: config.owner,
        repo: repository.name,
        name: label.name,
        description: label.description,
        color: label.color
      });
    } catch (error: any) {
      app.log.error(error);
      return;
    }
  });

  // for (let i = 0; i < config.labels.length; i++) {
  //   const label = config.labels[i];
  //   try {
  //     await context.octokit.issues.createLabel({
  //       owner: config.owner,
  //       repo: repository.name,
  //       name: label.name,
  //       description: label.description,
  //       color: label.color
  //     });
  //   } catch (error: any) {
  //     app.log.error(error);
  //     return;
  //   }
  // }
};
