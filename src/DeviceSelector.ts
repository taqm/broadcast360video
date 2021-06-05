const getInputDevices = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  const infos = await navigator.mediaDevices.enumerateDevices();
  return infos.reduce<Record<'audio' | 'video', MediaDeviceInfo[]>>(({
    audio, video
  }, cur) => {
    switch (cur.kind) {
      case 'audioinput':
        return { audio: [...audio, cur], video };
      case 'videoinput':
        return { audio, video: [...video, cur] };
    }
      return { audio, video };
  }, { audio: [], video: [] });
};

const appendOptions = (selectElem: HTMLSelectElement, infos: MediaDeviceInfo[]) => {
  const opts = infos.map((it) => {
    const opt = document.createElement('option');
    opt.innerText = it.label;
    opt.value = it.deviceId;
    return opt;
  });
  selectElem.append(...opts);
};

type OnChangeEvent = {
  audioDeviceId: string | null;
  videoDeviceId: string | null;
};

export class DeviceSelector {
  readonly #audioElem: HTMLSelectElement;
  readonly #videoElem: HTMLSelectElement;
  readonly #onChangeTopic = Symbol('onChange');

  constructor(
    audioSelectElem: HTMLSelectElement,
    videoSelectElem: HTMLSelectElement,
  ) {
    this.#audioElem = audioSelectElem;
    this.#videoElem = videoSelectElem;

    audioSelectElem.addEventListener('change', () => {
      PubSub.publish(this.#onChangeTopic);
    });

    videoSelectElem.addEventListener('change', () => {
      PubSub.publish(this.#onChangeTopic);
    });

    this.init();
  }

  private async init() {
    const { audio, video} = await getInputDevices();
    appendOptions(this.#audioElem, audio);
    appendOptions(this.#videoElem, video);
  }

  onChange(cb: (ev: OnChangeEvent) => void) {
    PubSub.subscribe(this.#onChangeTopic, () => {
      const ev: OnChangeEvent = {
        audioDeviceId: this.#audioElem.value || null,
        videoDeviceId: this.#videoElem.value || null,
      };
      cb(ev);
    });
  }
}
