/* eslint-disable @typescript-eslint/no-explicit-any */

declare function log(message: any): void;
declare function logError(err: Error, message?: string): void;
declare interface IExtension {
	enable(): void,
	disable(): void;
}

declare interface ISubExtension {
	apply?(): void,
	destroy(): void;
}

declare interface Math {
	clamp(num: number, min: number, max: number): number;
}

// types
declare type KeysOfType<T, U> = { [P in keyof T]: T[P] extends U ? P : never; }[keyof T];
declare type KeysThatStartsWith<K extends string, U extends string> = K extends `${U}${infer _R}` ? K : never;

declare interface ExtensionMeta {
	uuid: string,
	'settings-schema'?: string,
	'gettext-domain'?: string
}
