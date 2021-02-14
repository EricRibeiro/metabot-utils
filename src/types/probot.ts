export type MetabotWebhookPayloadPullRequest = import('@octokit/webhooks/dist-types/generated/event-payloads')
    .EventPayloads
    .WebhookPayloadPullRequest & {
        botComment: String,
        botName: String
    }

export type MetabotWebhookEvents = import('@octokit/webhooks/dist-types/generated/get-webhook-payload-type-from-event')
    .WebhookEvents