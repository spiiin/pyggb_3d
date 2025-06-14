import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
  setGgbLabelFromArgs,
} from "../shared";
import { SkObject, SkulptApi, KeywordArgsArray } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
declare var Sk: SkulptApi;

interface SkGgbCross extends SkGgbObject {}

type SkGgbCrossCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "vectors";
      vector1: SkGgbObject;
      vector2: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Cross", {
    constructor: function Cross(this: SkGgbCross, spec: SkGgbCrossCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Cross");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "vectors": {
          setLabelArgs([spec.vector1.$ggbLabel, spec.vector2.$ggbLabel]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Cross spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$as_number: true,
      tp$new(args: Array<SkObject>, kwargs: KeywordArgsArray) {
        const badArgsError = new Sk.builtin.TypeError(
          "Cross() arguments must be (vector1, vector2)"
        );

        const make = (spec: SkGgbCrossCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Cross(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.isGgbObjectOfType(args[0], "vector") && ggb.isGgbObjectOfType(args[1], "vector")) {
              return make({
                kind: "vectors",
                vector1: args[0],
                vector2: args[1],
              });
            }
            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
      tp$str() {
        return new Sk.builtin.str(`Cross(${this.$ggbLabel})`);
      },
      tp$repr() {
        return this.tp$str();
      },
      nb$negative() {
        const ggbCmd = `-${this.$ggbLabel}`;
        const lbl = ggb.evalCmd(ggbCmd);
        if (!lbl) {
          throw new Sk.builtin.TypeError("GeoGebra negative operation failed");
        }
        return ggb.wrapExistingGgbObject(lbl);
      },
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
      ...ggb.deleteMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Cross = cls;
  registerObjectType("vector", cls);
}; 