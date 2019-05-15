import './style.less';
export interface configureOptions {
    minimum?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    positionUsing?: string;
    speed?: number;
    showSpinner?: boolean;
    parent?: string;
    template?: string;
}
declare class NProgress {
    static version: string;
    settings: {
        minimum: number;
        easing: string;
        positionUsing: string;
        speed: number;
        trickle: boolean;
        trickleSpeed: number;
        showSpinner: boolean;
        barSelector: string;
        spinnerSelector: string;
        parent: string;
        template: string;
    };
    status: number;
    el: HTMLElement;
    configure(options: configureOptions): NProgress;
    isStarted(): boolean;
    isRendered(): boolean;
    render(fromStart: boolean): HTMLElement;
    remove(): void;
    set(n: number): NProgress;
    start(): NProgress;
    done(force: boolean): NProgress;
    error(force: boolean): NProgress;
    inc(amount?: number): NProgress;
}
declare const _default: NProgress;
export default _default;
