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
    }
  | {
      kind: "polygon";
      polygon: string;
    }
  | {
      kind: "point-parallel";
      point: string;
      plane: string;
    }
  | {
      kind: "two-lines";
      line1: string;
      line2: string;
    }
  | {
      kind: "point-vectors";
      point: string;
      vector1: string;
      vector2: string;
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
        case "polygon": {
          setLabelArgs([spec.polygon]);
          break;
        }
        case "point-parallel": {
          setLabelArgs([spec.point, spec.plane]);
          break;
        }
        case "two-lines": {
          setLabelArgs([spec.line1, spec.line2]);
          break;
        }
        case "point-vectors": {
          setLabelArgs([spec.point, spec.vector1, spec.vector2]);
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
          "Plane() arguments must be one of:\n" +
          "  (point1, point2, point3)\n" +
          "  (polygon)\n" +
          "  (point, plane)\n" +
          "  (line1, line2)\n" +
          "  (point, vector1, vector2)"
        );

        const make = (spec: SkGgbPlaneCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Plane(spec), kwargs);

        switch (args.length) {
          case 1: {
            if (!ggb.isGgbObject(args[0])) {
              throw badArgsError;
            }
            const objType = ggb.ggbType(args[0] as SkGgbObject);
            if (objType === "polygon" || 
                objType === "polygon3D" || 
                objType === "quadrilateral" || 
                objType === "pentagon" || 
                objType === "hexagon" || 
                objType === "triangle") {
              return make({
                kind: "polygon",
                polygon: (args[0] as SkGgbObject).$ggbLabel,
              });
            }
            throw badArgsError;
          }
          case 2: {
            if (ggb.isGgbObjectOfType(args[0], "point") && 
                ggb.isGgbObjectOfType(args[1], "plane")) {
              return make({
                kind: "point-parallel",
                point: args[0].$ggbLabel,
                plane: args[1].$ggbLabel,
              });
            }
            if (ggb.isGgbObjectOfType(args[0], "line") && 
                ggb.isGgbObjectOfType(args[1], "line")) {
              return make({
                kind: "two-lines",
                line1: args[0].$ggbLabel,
                line2: args[1].$ggbLabel,
              });
            }
            throw badArgsError;
          }
          case 3: {
            if (args.every(arg => ggb.isGgbObjectOfType(arg, "point"))) {
              const points = args as Array<SkGgbObject>;
              return make({
                kind: "three-points",
                p1: points[0].$ggbLabel,
                p2: points[1].$ggbLabel,
                p3: points[2].$ggbLabel,
              });
            }
            if (ggb.isGgbObjectOfType(args[0], "point") && 
                ggb.isGgbObjectOfType(args[1], "vector") && 
                ggb.isGgbObjectOfType(args[2], "vector")) {
              return make({
                kind: "point-vectors",
                point: args[0].$ggbLabel,
                vector1: args[1].$ggbLabel,
                vector2: args[2].$ggbLabel,
              });
            }
            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
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
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Plane = cls;
  registerObjectType("plane", cls);
}; 