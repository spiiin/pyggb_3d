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

interface SkGgbPlane extends SkGgbObject {}

type SkGgbPlaneCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "three-points";
      p1: string;
      p2: string;
      p3: string;
    };

export const register = (
  mod: { Plane: SpecConstructible<SkGgbPlaneCtorSpec, SkGgbPlane> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Plane", {
    constructor: function Plane(this: SkGgbPlane, spec: SkGgbPlaneCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Plane");
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "three-points": {
          setLabelArgs([spec.p1, spec.p2, spec.p3]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Plane spec kind "${(spec as any).kind}"`
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
          "Plane() arguments must be (point1, point2, point3)"
        );

        const make = (spec: SkGgbPlaneCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Plane(spec), kwargs);

        if (args.length !== 3) {
          throw badArgsError;
        }

        // Check that all arguments are points
        args.forEach((arg: SkObject, i: number) => {
          if (!ggb.isGgbObjectOfType(arg, "point")) {
            throw new Sk.builtin.TypeError(`point${i + 1} must be a point`);
          }
        });

        const points = args as Array<SkGgbObject>;
        return make({
          kind: "three-points",
          p1: points[0].$ggbLabel,
          p2: points[1].$ggbLabel,
          p3: points[2].$ggbLabel,
        });
      },
      tp$str(this: SkGgbPlane) {
        return new Sk.builtin.str(`Plane(${this.$ggbLabel})`);
      },
      $r(this: SkGgbPlane) {
        return new Sk.builtin.str(`Plane(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbPlane) {
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
        $meth(this: SkGgbPlane, pyFun: any) {
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

  mod.Plane = cls;
  registerObjectType("plane", cls);
}; 