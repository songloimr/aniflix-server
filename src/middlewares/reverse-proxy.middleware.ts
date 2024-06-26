import { NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export class ReverseProxyMiddleware implements NestMiddleware {
    TIMEOUT = 60 * 1000;
    private proxy = createProxyMiddleware({
        target: 'https://api.jikan.moe',
        changeOrigin: true, // Needed for virtual hosted sites
        logLevel: 'debug',
        proxyTimeout: this.TIMEOUT,
        timeout: this.TIMEOUT,
        pathRewrite: {
            '^/jikan': '/v4', // Rewrite path from /jikan to /v4
        },
        onProxyReq: (proxyReq, req, res) => {
            // console.log(
            //     `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`
            // );
        },
    });
    

    constructor() { }

    use(req: Request, res: Response, next: () => void) {
        this.proxy(req, res, next);
    }
}