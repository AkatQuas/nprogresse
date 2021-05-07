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
declare class NProgressE {
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
    configure(options: configureOptions): NProgressE;
    isStarted(): boolean;
    isRendered(): boolean;
    render(fromStart: boolean): HTMLElement;
    remove(): void;
    set(n: number): NProgressE;
    start(): NProgressE;
    done(force: boolean): NProgressE;
    error(force: boolean): NProgressE;
    inc(amount?: number): NProgressE;
}
declare const _default: NProgressE;
export default _default;
