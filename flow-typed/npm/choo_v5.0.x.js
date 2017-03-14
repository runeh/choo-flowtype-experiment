// @flow

declare type UseCallback<EVENTS, MODEL> =
    (state: MODEL, emitter: Emitter<EVENTS>) => void;

declare type InternalChooEvents = 'render' | 'DOMContentLoaded';
declare type WildcardChooEvent = '*';

// Should beseparate typedef for nanoemitter I guess
declare type EmitterCallback = (data: any) => void;
declare type EmitterWildcardCallback = (name: string, data: any) => void;

declare class Emitter<EVENTS> {
    on(event: EVENTS, callback: EmitterCallback): void;
    on(event: WildcardChooEvent, callback: EmitterWildcardCallback): void;
    emit(event: EVENTS, payload: any): void;
}

declare type EmitFun<EVENTS> = (name: EVENTS, data: any) => void;

declare type ViewFunction<EVENTS, MODEL> = (state: MODEL, emit: EmitFun<EVENTS>) => any; // should be html

declare class ChooApp<EVENTS, MODEL> {
    use(callback: UseCallback<EVENTS | InternalChooEvents, MODEL>): void;
    // fixme: should grok yo-yo template strings returning elements.
    route(routeName: string, ViewFunction<EVENTS, MODEL>): void;
    mount(selector: string): void;
    start(): HTMLElement;
    toString(location: string, state?: MODEL): string;
}

// fixme: export explicitly UseCallback
// fixme: name 'UseCallback' something else
// fixme: also export choo/html?
// fixme: naming with dollars in them?
declare module 'choo' {
    declare module.exports: () => ChooApp<*, *>;
}
