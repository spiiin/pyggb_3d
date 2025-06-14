import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  withPropertiesFromNameValuePairs,
  SkGgbObject,
  WrapExistingCtorSpec,
  SpecConstructible,
} from "../shared";
import { SkObject, SkulptApi, KeywordArgsArray } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbConvexHull extends SkGgbObject {}

type SkGgbConvexHullCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "points-array";
      points: Array<SkGgbObject>;
    };

export const register = (
  mod: { ConvexHull: SpecConstructible<SkGgbConvexHullCtorSpec, SkGgbConvexHull> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("ConvexHull", {
    constructor: function ConvexHull(this: SkGgbConvexHull, spec: SkGgbConvexHullCtorSpec) {
      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "points-array": {
          // Get the point labels
          const pointLabels = spec.points.map((p) => p.$ggbLabel);
          
          // Create a command that uses the GeoGebra syntax for a list
          // The command will be like: hull = ConvexHull[{A, B, C, ...}]
          const timestamp = Date.now();
          const hullName = `hull${timestamp}`;
          const cmd = `${hullName} = ConvexHull[{${pointLabels.join(", ")}}]`;
          
          try {
            // Execute the command
            ggb.evalCmd(cmd);
            
            // Check if the object was created
            if (!appApi.ggb.exists(hullName)) {
              throw new Sk.builtin.RuntimeError(
                "Failed to create ConvexHull - object does not exist after command"
              );
            }
            
            this.$ggbLabel = hullName;
          } catch (e: any) {
            throw new Sk.builtin.RuntimeError(
              `Failed to create ConvexHull: ${e.message || String(e)}`
            );
          }
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad ConvexHull spec kind "${(spec as any).kind}"`
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
          "ConvexHull() arguments must be a list of points"
        );

        const make = (spec: SkGgbConvexHullCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.ConvexHull(spec), kwargs);

        if (args.length !== 1) {
          throw badArgsError;
        }

        // Check if argument is a list/iterable
        if (!Sk.builtin.checkIterable(args[0])) {
          throw badArgsError;
        }

        // Convert the Python iterable to a JavaScript array
        const points = Sk.misceval.arrayFromIterable(args[0]);
        
        if (points.length < 3) {
          throw new Sk.builtin.ValueError(
            "ConvexHull() requires at least 3 points"
          );
        }
        
        // Check that all elements are GeoGebra point objects
        if (ggb.everyElementIsGgbObject(points)) {
          // Check that all objects are points
          for (const point of points) {
            const objType = ggb.ggbType(point as SkGgbObject);
            if (objType !== "point" && objType !== "point3D") {
              throw new Sk.builtin.TypeError(
                "ConvexHull() arguments must be a list of GeoGebra points"
              );
            }
          }
          
          return make({ kind: "points-array", points });
        }
        
        throw badArgsError;
      },
      tp$str(this: SkGgbConvexHull) {
        return new Sk.builtin.str(`ConvexHull(${this.$ggbLabel})`);
      },
      $r(this: SkGgbConvexHull) {
        return new Sk.builtin.str(`ConvexHull(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbConvexHull) {
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
        $meth(this: SkGgbConvexHull, pyFun: any) {
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
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
      area: {
        $get() {
          return new Sk.builtin.float_(ggb.getValue(this.$ggbLabel));
        },
      },
    },
  });

  mod.ConvexHull = cls;
  registerObjectType("convexhull", cls);
}; 