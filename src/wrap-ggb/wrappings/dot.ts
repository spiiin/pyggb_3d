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

interface SkGgbDot extends SkGgbObject {}

type SkGgbDotCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "vectors";
      vector1: SkGgbObject;
      vector2: SkGgbObject;
    };

export const register = (mod: any, appApi: AppApi) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Dot", {
    constructor: function Dot(this: SkGgbDot, spec: SkGgbDotCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Dot");

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
            `bad Dot spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args: Array<SkObject>, kwargs: KeywordArgsArray) {
        const badArgsError = new Sk.builtin.TypeError(
          "Dot() arguments must be (vector1, vector2)"
        );

        const make = (spec: SkGgbDotCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Dot(spec), kwargs);

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
        return new Sk.builtin.str(`Dot(${this.$ggbLabel})`);
      },
      tp$repr() {
        return this.tp$str();
      },
      nb$float() {
        return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
      },
      nb$multiply(other: SkGgbObject) {
        const thisVal = ggb.getValue(this.$ggbLabel);
        const otherVal = ggb.getValue(other.$ggbLabel);
        return new Sk.builtin.float_(thisVal * otherVal);
      },
      nb$add(other: SkGgbObject) {
        const thisVal = ggb.getValue(this.$ggbLabel);
        const otherVal = ggb.getValue(other.$ggbLabel);
        return new Sk.builtin.float_(thisVal + otherVal);
      },
      nb$subtract(other: SkGgbObject) {
        const thisVal = ggb.getValue(this.$ggbLabel);
        const otherVal = ggb.getValue(other.$ggbLabel);
        return new Sk.builtin.float_(thisVal - otherVal);
      },
      nb$divide(other: SkGgbObject) {
        const thisVal = ggb.getValue(this.$ggbLabel);
        const otherVal = ggb.getValue(other.$ggbLabel);
        if (otherVal === 0) {
          throw new Error("division by zero");
        }
        return new Sk.builtin.float_(thisVal / otherVal);
      },
      tp$richcompare(other: SkObject, op: string) {
        const thisVal = ggb.getValue(this.$ggbLabel);
        let otherVal: number;
        
        if (other instanceof Sk.builtin.int_ || other instanceof Sk.builtin.float_) {
          otherVal = (other as any).v;
        } else if (other instanceof mod.Dot) {
          otherVal = ggb.getValue((other as SkGgbDot).$ggbLabel);
        } else {
          return (Sk.builtin as any).NotImplemented.NotImplemented$;
        }

        switch (op) {
          case "Lt":
            return new Sk.builtin.bool(thisVal < otherVal);
          case "LtE":
            return new Sk.builtin.bool(thisVal <= otherVal);
          case "Eq":
            return new Sk.builtin.bool(thisVal === otherVal);
          case "NotEq":
            return new Sk.builtin.bool(thisVal !== otherVal);
          case "Gt":
            return new Sk.builtin.bool(thisVal > otherVal);
          case "GtE":
            return new Sk.builtin.bool(thisVal >= otherVal);
          default:
            return (Sk.builtin as any).NotImplemented.NotImplemented$;
        }
      },
    },
    methods: {
      ...ggb.withPropertiesMethodsSlice,
      ...ggb.freeCopyMethodsSlice,
      ...ggb.deleteMethodsSlice,
    },
    getsets: {
      value: {
        $get() {
          return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
        },
      },
      is_visible: ggb.sharedGetSets.is_visible,
      is_independent: ggb.sharedGetSets.is_independent,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      size: ggb.sharedGetSets.size,
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Dot = cls;
  registerObjectType("number", cls);
}; 