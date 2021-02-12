import axios from 'axios';
import cryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

export class EventManager {

    url: string;
    secret: string;

    constructor(webhookUrl: string, webhookSecret: string) {
        this.url = webhookUrl;
        this.secret = webhookSecret;
    }

    public async createEvent(userAgent: String, gitHubEvent: string, gitHubHookId: string, gitHubTargetId: string, payload: string) {
        const headers = {
            'Accept': '*/*',
            'Connection': 'close',
            'Content-Type': 'application/json',
            'User-Agent': userAgent,
            'X-GitHub-Delivery': uuidv4(),
            'X-GitHub-Event': gitHubEvent,
            'X-GitHub-Hook-ID': gitHubHookId,
            'X-GitHub-Hook-Installation-Target-ID': gitHubTargetId,
            'X-GitHub-Hook-Installation-Target-Type': 'integration',
            'X-Hub-Signature': `sha1=${cryptoJS.HmacSHA1(payload, this.secret).toString(cryptoJS.digest)}`,
            'X-Hub-Signature-256': `sha256=${cryptoJS.HmacSHA256(payload, this.secret).toString(cryptoJS.digest)}`
        }

        const response = await axios({
            method: 'post',
            url: this.url,
            data: payload,
            headers
        });

        return response;
    }
}