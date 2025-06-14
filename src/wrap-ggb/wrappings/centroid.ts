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

interface SkGgbCentroid extends SkGgbObject {}

type SkGgbCentroidCtorSpec =
  | WrapExistingCtorSpec
  | {
      kind: "polygon";
      polygon: string;
    };

export const register = (
  mod: { Centroid: SpecConstructible<SkGgbCentroidCtorSpec, SkGgbCentroid> },
  appApi: AppApi
) => {
  const ggb = augmentedGgbApi(appApi.ggb);

  const cls = Sk.abstr.buildNativeClass("Centroid", {
    constructor: function Centroid(this: SkGgbCentroid, spec: SkGgbCentroidCtorSpec) {
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Centroid");
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          break;
        }
        case "polygon": {
          setLabelArgs([spec.polygon]);
          break;
        }
        default:
          throw new Sk.builtin.TypeError(
            `bad Centroid spec kind "${(spec as any).kind}"`
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
          "Centroid() arguments must be (polygon)"
        );

        const make = (spec: SkGgbCentroidCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Centroid(spec), kwargs);

        if (args.length !== 1) {
          throw badArgsError;
        }

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
      },
      tp$str(this: SkGgbCentroid) {
        return new Sk.builtin.str(`Centroid(${this.$ggbLabel})`);
      },
      $r(this: SkGgbCentroid) {
        return new Sk.builtin.str(`Centroid(${this.$ggbLabel})`);
      },
      ...ggb.sharedOpSlots,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbCentroid) {
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
        $meth(this: SkGgbCentroid, pyFun: any) {
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
      size: ggb.sharedGetSets.size,
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
    },
  });

  mod.Centroid = cls;
  registerObjectType("centroid", cls);
}; 