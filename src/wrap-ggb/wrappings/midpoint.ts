import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  WrapExistingCtorSpec,
  SpecConstructible,
  setGgbLabelFromArgs,
  setGgbLabelFromCmd,
} from "../shared";
import { SkObject, SkulptApi, KeywordArgsArray } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbMidpoint extends SkGgbObject {}

type SkGgbMidpointCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "segment";
      segment: string;
    }
  | {
      kind: "points";
      point1: string;
      point2: string;
    };

export const register = (
  mod: { Midpoint: SpecConstructible<SkGgbMidpointCtorSpec, SkGgbMidpoint> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Midpoint", {
    constructor: function Midpoint(this: SkGgbMidpoint, spec: SkGgbMidpointCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Midpoint");
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "segment": {
          setLabelArgs([spec.segment]);
          break;
        }
        case "points": {
          setLabelArgs([spec.point1, spec.point2]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Midpoint spec kind "${(spec as any).kind}"`
          );
      }

      this.$updateHandlers = [];
      ggb.registerObjectUpdateListener(this.$ggbLabel, () =>
        this.$fireUpdateEvents()
      );
    },
    slots: {
      tp$new(args: Array<SkObject>, kwargs: KeywordArgsArray) {
        const badArgsError = new Sk.builtin.TypeError(
          "Midpoint() arguments must be one of:\n" +
          "  (segment)\n" +
          "  (point1, point2)"
        );

        const make = (spec: SkGgbMidpointCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Midpoint(spec), kwargs);

        switch (args.length) {
          case 1: {
            if (!ggb.isGgbObjectOfType(args[0], "segment")) {
              throw badArgsError;
            }
            return make({
              kind: "segment",
              segment: args[0].$ggbLabel,
            });
          }
          case 2: {
            if (!ggb.isGgbObjectOfType(args[0], "point") || 
                !ggb.isGgbObjectOfType(args[1], "point")) {
              throw badArgsError;
            }
            return make({
              kind: "points",
              point1: args[0].$ggbLabel,
              point2: args[1].$ggbLabel,
            });
          }
          default:
            throw badArgsError;
        }
      },
      tp$str(this: SkGgbMidpoint) {
        return new Sk.builtin.str(`Midpoint(${this.$ggbLabel})`);
      },
      $r(this: SkGgbMidpoint) {
        return new Sk.builtin.str(`Midpoint(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbMidpoint) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            appApi.sk.onError(e as any);
          }
        });
      },
    },
    methods: {
      when_moved: {
        $meth(this: SkGgbMidpoint, pyFun: any) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
      ...ggb.deleteMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      opacity: ggb.sharedGetSets.opacity,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Midpoint = cls;
  registerObjectType("midpoint", cls);
}; 