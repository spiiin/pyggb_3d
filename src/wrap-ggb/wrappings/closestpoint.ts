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

interface SkGgbClosestPoint extends SkGgbObject {}

type SkGgbClosestPointCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "path-point";
      path: SkGgbObject;
      point: SkGgbObject;
    }
  | {
      kind: "line-line";
      line1: SkGgbObject;
      line2: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("ClosestPoint", {
    constructor: function ClosestPoint(this: SkGgbClosestPoint, spec: SkGgbClosestPointCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "ClosestPoint");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "path-point": {
          setLabelArgs([spec.path.$ggbLabel, spec.point.$ggbLabel]);
          break;
        }
        case "line-line": {
          setLabelArgs([spec.line1.$ggbLabel, spec.line2.$ggbLabel]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad ClosestPoint spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args: Array<SkObject>, kwargs: KeywordArgsArray) {
        const badArgsError = new Sk.builtin.TypeError(
          "ClosestPoint() arguments must be one of:\n" +
          "  (path, point)\n" +
          "  (line, line)"
        );

        const make = (spec: SkGgbClosestPointCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.ClosestPoint(spec), kwargs);

        if (args.length !== 2) {
          throw badArgsError;
        }

        // Check for path-point case
        if (ggb.isGgbObjectOfType(args[1], "point")) {
          const pathTypes = ["line", "segment", "ray", "circle", "ellipse", "hyperbola", 
                           "parabola", "polygon", "polygon3D", "triangle", "quadrilateral", 
                           "pentagon", "hexagon", "plane", "function", "locus"];
          
          if (ggb.isGgbObject(args[0]) && pathTypes.includes(ggb.ggbType(args[0] as SkGgbObject))) {
            return make({
              kind: "path-point",
              path: args[0],
              point: args[1]
            });
          }
        }

        // Check for line-line case
        if (ggb.isGgbObjectOfType(args[0], "line") && ggb.isGgbObjectOfType(args[1], "line")) {
          return make({
            kind: "line-line",
            line1: args[0],
            line2: args[1]
          });
        }

        throw badArgsError;
      },
      tp$str() {
        return new Sk.builtin.str(`ClosestPoint(${this.$ggbLabel})`);
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

  mod.ClosestPoint = cls;
  registerObjectType("point", cls);
}; 