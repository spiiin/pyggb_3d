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

interface SkGgbUnitVector extends SkGgbObject {}

type SkGgbUnitVectorCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "vector";
      vector: SkGgbObject;
    }
  | {
      kind: "line";
      line: SkGgbObject;
    }
  | {
      kind: "segment";
      segment: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("UnitVector", {
    constructor: function UnitVector(this: SkGgbUnitVector, spec: SkGgbUnitVectorCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "UnitVector");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "vector": {
          setLabelArgs([spec.vector.$ggbLabel]);
          break;
        }
        case "line": {
          setLabelArgs([spec.line.$ggbLabel]);
          break;
        }
        case "segment": {
          setLabelArgs([spec.segment.$ggbLabel]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad UnitVector spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args: Array<SkObject>, kwargs: KeywordArgsArray) {
        const badArgsError = new Sk.builtin.TypeError(
          "UnitVector() argument must be a vector, line, or segment"
        );

        const make = (spec: SkGgbUnitVectorCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.UnitVector(spec), kwargs);

        switch (args.length) {
          case 1: {
            if (ggb.isGgbObjectOfType(args[0], "vector")) {
              return make({
                kind: "vector",
                vector: args[0],
              });
            }
            if (ggb.isGgbObjectOfType(args[0], "line")) {
              return make({
                kind: "line",
                line: args[0],
              });
            }
            if (ggb.isGgbObjectOfType(args[0], "segment")) {
              return make({
                kind: "segment",
                segment: args[0],
              });
            }
            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
      tp$str() {
        return new Sk.builtin.str(`UnitVector(${this.$ggbLabel})`);
      },
      tp$repr() {
        return this.tp$str();
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
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.UnitVector = cls;
  registerObjectType("vector", cls);
}; 