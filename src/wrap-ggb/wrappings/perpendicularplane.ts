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

interface SkGgbPerpendicularPlane extends SkGgbObject {}

type SkGgbPerpendicularPlaneCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "point-line";
      point: string;
      line: string;
    }
  | {
      kind: "point-vector";
      point: string;
      vector: string;
    };

export const register = (
  mod: { PerpendicularPlane: SpecConstructible<SkGgbPerpendicularPlaneCtorSpec, SkGgbPerpendicularPlane> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("PerpendicularPlane", {
    constructor: function PerpendicularPlane(this: SkGgbPerpendicularPlane, spec: SkGgbPerpendicularPlaneCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "PerpendicularPlane");
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "point-line": {
          setLabelArgs([spec.point, spec.line]);
          break;
        }
        case "point-vector": {
          setLabelArgs([spec.point, spec.vector]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad PerpendicularPlane spec kind "${(spec as any).kind}"`
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
          "PerpendicularPlane() arguments must be one of:\n" +
          "  (point, line)\n" +
          "  (point, vector)"
        );

        const make = (spec: SkGgbPerpendicularPlaneCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.PerpendicularPlane(spec), kwargs);

        if (args.length !== 2) {
          throw badArgsError;
        }

        if (!ggb.isGgbObjectOfType(args[0], "point")) {
          throw badArgsError;
        }

        if (ggb.isGgbObjectOfType(args[1], "line")) {
          return make({
            kind: "point-line",
            point: args[0].$ggbLabel,
            line: args[1].$ggbLabel,
          });
        }

        if (ggb.isGgbObjectOfType(args[1], "vector")) {
          return make({
            kind: "point-vector",
            point: args[0].$ggbLabel,
            vector: args[1].$ggbLabel,
          });
        }

        throw badArgsError;
      },
      tp$str(this: SkGgbPerpendicularPlane) {
        return new Sk.builtin.str(`PerpendicularPlane(${this.$ggbLabel})`);
      },
      $r(this: SkGgbPerpendicularPlane) {
        return new Sk.builtin.str(`PerpendicularPlane(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbPerpendicularPlane) {
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
        $meth(this: SkGgbPerpendicularPlane, pyFun: any) {
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
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.PerpendicularPlane = cls;
  registerObjectType("perpendicularplane", cls);
}; 