import Clutter from '@gi-types/clutter';
import St from '@gi-types/st';
import Gio from '@gi-types/gio';
import Shell from '@gi-types/shell';
import Meta from '@gi-types/meta';
import GObject from '@gi-types/gobject';

declare const global: import('@gi-types/shell').Global;

declare interface ExtensionMeta {
	uuid: string,
	'settings-schema': string,
	'gettext-domain': string
}

declare interface ExtensionUtilsMeta {
	getSettings(schema?: string): Gio.Settings;
	getCurrentExtension(): {
		metadata: ExtensionMeta,
		dir: Gio.FilePrototype,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		imports: any,
	};
	initTranslations(domain?: string): void;
}

declare namespace __shell_private_types {
	declare class TouchpadGesture extends GObject.Object {
		_stageCaptureEvent: number;
		destroy(): void;
		_handleEvent(actor: Clutter.Actor | undefined, event: CustomEventType): boolean;
	}

	declare interface IMonitorState {
		x: number,
		y: number,
		width: number,
		height: number,
		geometry_scale: number,
		index: number,
		inFullscreen: () => boolean,
	}
}

declare namespace imports {
	namespace gettext {
		function domain(name: string): { gettext(message: string): string; };
	}

	namespace misc {
		declare const extensionUtils: ExtensionUtilsMeta;
	}
	namespace ui {
		namespace main {
			const actionMode: Shell.ActionMode;
			function notify(message: string): void;
			function activateWindow(window: Meta.Window, time?: number, workspaceNum?: number): void;

			const panel: {
				addToStatusArea(role: string, indicator: Clutter.Actor, position?: number, box?: string): void,
			} & Clutter.Actor;

			const overview: {
				dash: {
					showAppsButton: St.Button
				};
				searchEntry: St.Entry,
				shouldToggleByCornerOrButton(): boolean,
				visible: boolean,
				show(): void,
				hide(): void,
				showApps(): void,
				animationInProgress: boolean;
				connect(signal: 'showing' | 'hiding' | 'hidden' | 'shown', callback: () => void): number,
				disconnect(id: number): void,
				_overview: {
					_controls: overviewControls.OverviewControlsManager
				} & St.Widget
				_gestureBegin(tracker: {
					confirmSwipe: typeof swipeTracker.SwipeTracker.prototype.confirmSwipe;
				}): void;
				_gestureUpdate(tracker: swipeTracker.SwipeTracker, progress: number);
				_gestureEnd(tracker: swipeTracker.SwipeTracker, duration: number, endProgress: number);

				_swipeTracker: swipeTracker.SwipeTracker;
			};

			const layoutManager: {
				uiGroup: Clutter.Actor,
				panelBox: St.BoxLayout,
				primaryIndex: number,
				primaryMonitor: __shell_private_types.IMonitorState,
				currentMonitor: __shell_private_types.IMonitorState,
				getWorkAreaForMonitor: (index: number) => Meta.Rectangle,
			};

			const wm: {
				skipNextEffect(actor: Meta.WindowActor): void;
				_workspaceAnimation: workspaceAnimation.WorkspaceAnimationController;
			};

			const osdWindowManager: {
				hideAll(): void;
			};
		}

		namespace overviewControls {
			declare enum ControlsState {
				HIDDEN,
				WINDOW_PICKER,
				APP_GRID
			}

			declare class OverviewAdjustment extends St.Adjustment {
				getStateTransitionParams(): {
					initialState: ControlsState,
					finalState: ControlsState
					currentState: number,
					progress: number
				}
			}

			declare class OverviewControlsManager extends St.Widget {
				_stateAdjustment: OverviewAdjustment;
				layoutManager: Clutter.BoxLayout & {
					_searchEntry: St.Bin
				}

				_toggleAppsPage(): void

				_workspacesDisplay: {
					_swipeTracker: swipeTracker.SwipeTracker
				}

				_appDisplay: {
					_swipeTracker: swipeTracker.SwipeTracker
				}

				_searchController: {
					searchActive: boolean
				}
			}
		}

		namespace swipeTracker {
			declare class SwipeTracker extends GObject.Object {
				orientation: Clutter.Orientation;
				enabled: boolean;
				allowLongSwipes: boolean;
				confirmSwipe(distance: number, snapPoints: number[], currentProgress: number, cancelProgress: number): void;
				destroy(): void;

				_touchGesture?: Clutter.GestureAction;
				_touchpadGesture?: __shell_private_types.TouchpadGesture;
				// custom
				__oldTouchpadGesture?: __shell_private_types.TouchpadGesture;
				//
				_allowedModes: Shell.ActionMode;

				_progress: number;
				_beginGesture(): void;
				_updateGesture(): void;
				_endTouchpadGesture(): void;
				_history: {
					reset(): void;
				}
			}
		}

		namespace panelMenu {
			declare class Button extends St.Widget {
				constructor(menuAlignment: number, nameText?: string, dontCreateMenu?: boolean);
				container: St.Bin;
				menu: popupMenu.PopupMenuItem;
			}
		}

		namespace popupMenu {
			declare class PopupMenuItem extends St.BoxLayout {
				constructor(text: string);
				addMenuItem(subMenu: PopupMenuItem);
			}
		}

		namespace workspaceAnimation {
			declare class WorkspaceAnimationController {
				_swipeTracker: swipeTracker.SwipeTracker;
				_switchWorkspaceBegin(tracker: {
					orientation: Clutter.Orientation,
					confirmSwipe: typeof swipeTracker.SwipeTracker.prototype.confirmSwipe
				}, monitor: never);

				_switchWorkspaceUpdate(tracker: swipeTracker.SwipeTracker, progress: number);
				_switchWorkspaceEnd(tracker: swipeTracker.SwipeTracker, duration: number, progress: number);
			}
		}
	}
}

declare namespace imports {
	namespace misc {
		namespace util {
			function spawn(argv: string[]): void;
			function lerp(start: number, end: number, progress: number): number;
		}
	}

	namespace ui {
		namespace switcherPopup {
			declare class SwitcherPopup extends St.Widget {
				constructor(items: never[]);
				_select(n: number): void;
				_selectedIndex: number;

				_resetNoModsTimeout(): void;
				_noModsTimeoutId: number;

				_initialDelayTimeoutId: number;
				_showImmediately(): void;
				_finish(timestamp?: number): void;

				show(backward: boolean, binding: string, mask: number): boolean;
			}

			declare class SwitcherList extends St.Widget {
				_init(squareItems: never[]);
				_scrollView: St.ScrollView;
			}
		}

		namespace altTab {
			declare class ThumbnailSwitcher extends switcherPopup.SwitcherList { }

			declare class AppSwitcherPopup extends switcherPopup.SwitcherPopup {
				constructor();
				_currentWindow: number;

				_select(appIndex: number, windowIndex?: number, forceAppFocus?: boolean): void;

				_switcherList: switcherPopup.SwitcherList;
				_items: St.BoxLayout & {
					cachedWindows: Meta.Window[]
				}[];

				_createThumbnails(): void;
				_thumbnailTimeoutId: number;
				_thumbnails?: ThumbnailSwitcher;
			}

			declare class WindowSwitcherPopup extends switcherPopup.SwitcherPopup {
				constructor();
				_items: St.BoxLayout & {
					window: Meta.Window
				}[];

				_switcherList: switcherPopup.SwitcherList;
			}
		}
	}
}

/// custom types

declare interface CustomEventType {
	type(): Clutter.EventType,
	get_gesture_phase(): Clutter.TouchpadGesturePhase,
	get_touchpad_gesture_finger_count(): number,
	get_time(): number,
	get_coords(): [number, number],
	get_gesture_motion_delta_unaccelerated(): [number, number],
}