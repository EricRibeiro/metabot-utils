export type MetabotWebhookPayloadPullRequest = import('@octokit/webhooks/dist-types/generated/event-payloads')
    .EventPayloads
    .WebhookPayloadPullRequest & {
        botComment: string,
        botName: string
    }

export type MetabotWebhookEvents = import('@octokit/webhooks/dist-types/generated/get-webhook-payload-type-from-event')
    .WebhookEvents