type SoundCloudWidgetEventName =
  | "READY"
  | "PLAY"
  | "PAUSE"
  | "FINISH"
  | "PLAY_PROGRESS"
  | "SEEK"
  | "ERROR";

type SoundCloudPlayProgressEvent = {
  currentPosition: number;
  relativePosition: number;
  loadedProgress: number;
};

type SoundCloudUser = {
  id: number;
  username: string;
  permalink_url?: string;
};

type SoundCloudSound = {
  id: number;
  title: string;
  duration?: number;
  permalink_url?: string;
  artwork_url?: string | null;
  waveform_url?: string | null;
  user?: SoundCloudUser;
};

type SoundCloudWidget = {
  bind: (
    eventName: SoundCloudWidgetEventName | string,
    callback: (event?: SoundCloudPlayProgressEvent) => void
  ) => void;
  unbind: (eventName: SoundCloudWidgetEventName | string) => void;
  load: (url: string, options?: { auto_play?: boolean }) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  skip: (index: number) => void;
  seekTo: (milliseconds: number) => void;
  setVolume: (volume: number) => void;
  getVolume: (callback: (volume: number) => void) => void;
  getCurrentSound: (callback: (sound: SoundCloudSound) => void) => void;
  getSounds: (callback: (sounds: SoundCloudSound[]) => void) => void;
  getCurrentSoundIndex: (callback: (index: number) => void) => void;
  getDuration: (callback: (duration: number) => void) => void;
  getPosition: (callback: (position: number) => void) => void;
};

interface Window {
  SC?: {
    Widget: ((iframe: HTMLIFrameElement | string) => SoundCloudWidget) & {
      Events: Record<SoundCloudWidgetEventName, string>;
    };
  };
}
