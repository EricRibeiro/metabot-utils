import axios, { AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { toHmacSha1, toHmacSha256 } from './helpers/crypto'

import type { MetabotWebhookPayloadPullRequest, MetabotWebhookEvents } from "./types/probot";

export class EventManager {

    url: string;
    userAgent: string;
    gitHubHookId: string;
    gitHubTargetId: string;
    secret: string;
    installationId: number;
    installationNodeId: string;

    constructor() {
        this.url = process.env.WEBHOOK_PROXY_URL!;
        this.userAgent = process.env.METABOT_USER_AGENT!;
        this.gitHubHookId = process.env.WEBHOOK_PROXY_URL!;
        this.gitHubTargetId = process.env.METABOT_TARGET_ID!;
        this.secret = process.env.WEBHOOK_SECRET!;
        this.installationId = parseInt(process.env.METABOT_PAYLOAD_INSTALLATION_ID!);
        this.installationNodeId = process.env.METABOT_PAYLOAD_INSTALLATION_NODE_ID!;
    }

    public async createEvent(gitHubEvent: MetabotWebhookEvents, payload: MetabotWebhookPayloadPullRequest): Promise<AxiosResponse<any>> {
        const data = this.fixPayloadInstallationProps(payload, this.installationId, this.installationNodeId);
        const headers = this.createRequestHeaders(data, this.userAgent, gitHubEvent, this.gitHubHookId, this.gitHubTargetId, this.secret);

        const response = await axios({
            method: 'post',
            url: this.url,
            data: JSON.stringify(data),
            headers
        });

        return response;
    }

    private fixPayloadInstallationProps(payload: MetabotWebhookPayloadPullRequest, installationId: number, installationNodeId: string): MetabotWebhookPayloadPullRequest {
        if (payload?.installation?.id) payload.installation.id = installationId;
        if (payload?.installation?.node_id) payload.installation.node_id = installationNodeId;

        return payload;
    }

    private createRequestHeaders(payload: MetabotWebhookPayloadPullRequest, userAgent: string, gitHubEvent: MetabotWebhookEvents, gitHubHookId: string, gitHubTargetId: string, secret: string) {
        const stringifiedPayload = JSON.stringify(payload);
        
        return {
            'Accept': '*/*',
            'Connection': 'close',
            'Content-Type': 'application/json',
            'User-Agent': userAgent,
            'X-GitHub-Delivery': uuidv4(),
            'X-GitHub-Event': gitHubEvent,
            'X-GitHub-Hook-ID': gitHubHookId,
            'X-GitHub-Hook-Installation-Target-ID': gitHubTargetId,
            'X-GitHub-Hook-Installation-Target-Type': 'integration',
            'X-Hub-Signature': `sha1=${toHmacSha1(stringifiedPayload, secret)}`,
            'X-Hub-Signature-256': `sha256=${toHmacSha256(stringifiedPayload, secret)}`
        }
    }
}