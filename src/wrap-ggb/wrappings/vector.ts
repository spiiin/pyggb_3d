import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  SkGgbObject,
  setGgbLabelFromArgs,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";
declare var Sk: SkulptApi;

interface SkGgbVector extends SkGgbObject {}

type SkGgbVectorCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "points";
      point1: SkGgbObject;
      point2: SkGgbObject;
    }
  | {
      kind: "components";
      e1: SkObject;
      e2: SkObject;
    }
  | {
      kind: "point";
      point: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Vector", {
    constructor: function Vector(this: SkGgbVector, spec: SkGgbVectorCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Vector");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "points": {
          setLabelArgs([spec.point1.$ggbLabel, spec.point2.$ggbLabel]);
          break;
        }
        case "components": {
          const e1Arg = ggb.numberValueOrLabel(spec.e1);
          const e2Arg = ggb.numberValueOrLabel(spec.e2);
          setLabelArgs([`(${e1Arg},${e2Arg})`]);
          break;
        }
        case "point": {
          setLabelArgs([spec.point.$ggbLabel]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Vector spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$as_number: true,
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Vector() arguments must be" +
            " (start_point, end_point), (x_component, y_component), or (point)"
        );

        const make = (spec: SkGgbVectorCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Vector(spec), kwargs);

        switch (args.length) {
          case 1: {
            if (ggb.isGgbObjectOfType(args[0], "point")) {
              return make({ kind: "point", point: args[0] });
            }
            throw badArgsError;
          }
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({ kind: "points", point1: args[0], point2: args[1] });
            }
            if (args.every(ggb.isPythonOrGgbNumber)) {
              return make({ kind: "components", e1: args[0], e2: args[1] });
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },

      nb$negative() {
        const ggbCmd = `-${this.$ggbLabel}`;
        const lbl = ggb.evalCmd(ggbCmd);
        if (!lbl) {
          throw new Sk.builtin.TypeError("GeoGebra negative operation failed");
        }
        return ggb.wrapExistingGgbObject(lbl);
      },

      // ...sharedOpSlots,
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
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

  mod.Vector = cls;
  registerObjectType("vector", cls);
};
