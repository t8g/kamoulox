import { BehaviorSubject } from "rxjs";
import { Kamoulox } from "./kamoulox.service";

export class KamouloxSubject extends BehaviorSubject<Kamoulox> {
  change<K extends keyof Kamoulox>(key: K, value: Kamoulox[K]) {
    this.next({ ...this.value, [key]: value });
  }
}
