import { Injectable } from "@angular/core";
import { KamouloxConfigSubject, FieldConfig } from "./config.subject";
import { KamouloxSubject } from "./data.subject";
import {
  Observable,
  merge,
  ObservableInput,
  combineLatest,
  interval
} from "rxjs";
import { ignoreElements, map, distinctUntilChanged, tap } from "rxjs/operators";
import { mitterrandRule, pressingRule, beaujolaisRule } from "./kamoulox.rules";

export interface Kamoulox {
  canard: string;
  beaujolais: number;
  mitterrand: string;
  pressing: string;
}

type RuleFunction = (
  ...args: unknown[]
) => { config?: Partial<FieldConfig> } & Partial<Kamoulox>;

@Injectable({ providedIn: "root" })
export class KamouloxService {
  config$ = new KamouloxConfigSubject({
    canard: { visible: true },
    beaujolais: { visible: true },
    mitterrand: { visible: true },
    pressing: { visible: true, label: "pressing" }
  });

  kamoulox$ = new KamouloxSubject({
    canard: "",
    beaujolais: 0,
    mitterrand: "parapluie",
    pressing: ""
  });

  constructor() {}

  init(): Observable<never> {
    return this.mergeRules();
  }

  private mergeRules(): Observable<never> {
    const mitterrand = this.feedRule({
      keys: ["beaujolais", "canard"],
      rule: mitterrandRule
    }).pipe(
      map(({ config }) => {
        this.config$.update("mitterrand", config);
      })
    );

    const pressing = this.feedRule({
      keys: ["beaujolais", "mitterrand"],
      rule: pressingRule
      // sources: [interval(1000)]
    }).pipe(
      map(({ config, pressing }) => {
        console.log("pressing", pressing);
        config && this.config$.update("pressing", config);
        pressing && this.kamoulox$.change("pressing", pressing);
      })
    );

    const beaujolais = this.feedRule({
      keys: ["canard"],
      rule: beaujolaisRule
    }).pipe(
      map(({ beaujolais }) => {
        beaujolais && this.kamoulox$.change("beaujolais", beaujolais);
      })
    );

    return merge(mitterrand, pressing, beaujolais).pipe(ignoreElements());
  }

  private feedRule<K extends keyof Kamoulox>({
    keys,
    sources,
    rule
  }: {
    keys: Array<K>;
    sources?: Array<Observable<unknown>>;
    rule: RuleFunction;
  }): Observable<
    {
      config?: Partial<FieldConfig>;
    } & Partial<Kamoulox>
  > {
    const fromKamoulox$ = this.kamoulox$.pipe(
      map(kamoulox => keys.map(key => kamoulox[key])),
      distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))
    );

    sources = sources || [];

    return combineLatest([fromKamoulox$, ...sources]).pipe(
      map(([kamouloxValues, ...sourcesValues]: [Array<Kamoulox[K]>]) =>
        rule(...[...kamouloxValues, ...sourcesValues])
      )
    );
  }
}
