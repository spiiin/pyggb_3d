import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  WrapExistingCtorSpec,
  SpecConstructible,
  assembledCommand,
} from "../shared";
import { SkObject, SkulptApi, KeywordArgsArray } from "../../shared/vendor-types/skulptapi";
import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbTranslate extends SkGgbObject {}

type SkGgbTranslateCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "object-vector";
      object: SkGgbObject;
      vector: SkGgbObject;
    };

export const register = (
  mod: { Translate: SpecConstructible<SkGgbTranslateCtorSpec, SkGgbTranslate> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Translate", {
    constructor: function Translate(this: SkGgbTranslate, spec: SkGgbTranslateCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "object-vector": {
          const ggbCmd = assembledCommand("Translate", [spec.object.$ggbLabel, spec.vector.$ggbLabel]);
          const label = ggb.evalCmd(ggbCmd);
          if (!label) {
            throw new Sk.builtin.RuntimeError("GeoGebra Translate command failed");
          }
          this.$ggbLabel = label;
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Translate spec kind "${(spec as any).kind}"`
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
          "Translate() arguments must be (object, vector)"
        );
        const make = (spec: SkGgbTranslateCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Translate(spec), kwargs);
        if (args.length !== 2) {
          throw badArgsError;
        }
        if (!ggb.isGgbObject(args[0]) || !ggb.isGgbObjectOfType(args[1], "vector")) {
          throw badArgsError;
        }
        return make({ kind: "object-vector", object: args[0], vector: args[1] });
      },
      tp$str(this: SkGgbTranslate) {
        return new Sk.builtin.str(`Translate(${this.$ggbLabel})`);
      },
      $r(this: SkGgbTranslate) {
        return new Sk.builtin.str(`Translate(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbTranslate) {
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
        $meth(this: SkGgbTranslate, pyFun: any) {
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
      line_thickness: ggb.sharedGetSets.line_thickness,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });
  mod.Translate = cls;
  registerObjectType("translate", cls);
}; 