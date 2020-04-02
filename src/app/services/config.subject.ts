import { BehaviorSubject, Observable, ObservableInput } from "rxjs";
import { Kamoulox } from "./kamoulox.service";
import { map } from "rxjs/operators";

export type FieldConfig = {
  disabled?: boolean;
  label?: string;
  visible?: boolean;
};

export type FieldConfig$ = {
  [key in keyof FieldConfig]: Observable<FieldConfig[key]>;
};

type Config<T> = {
  [key in keyof T]: FieldConfig;
};

export type KamouloxConfig = Config<Kamoulox>;

// export type Kamouloxify = {
//   [key in keyof Kamoulox]: unknown;
// };

export class KamouloxConfigSubject extends BehaviorSubject<KamouloxConfig> {
  canard: FieldConfig$;
  mitterrand: FieldConfig$;
  pressing: FieldConfig$;
  beaujolais: FieldConfig$;

  constructor(config: KamouloxConfig) {
    super(config);
    return proxy(this);
  }

  update<K extends keyof Kamoulox>(key: K, value: Partial<FieldConfig>) {
    this.next({ ...this.value, [key]: { ...this.value[key], ...value } });
  }
}

function proxy(k: KamouloxConfigSubject) {
  return new Proxy(k, {
    get(obj, prop) {
      return prop in obj
        ? obj[prop]
        : obj.value[prop] !== undefined
        ? ({
            disabled: obj.pipe(map(k => k[prop].disabled)),
            label: obj.pipe(map(k => k[prop].label)),
            visible: obj.pipe(map(k => k[prop].visible))
          } as FieldConfig$)
        : undefined;
    }
  });
}
