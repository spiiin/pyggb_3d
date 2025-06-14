import { AppApi } from "../../shared/appApi";
import {
  augmentedGgbApi,
  setGgbLabelFromArgs,
  setGgbLabelFromCmd,
  SkGgbObject,
  withPropertiesFromNameValuePairs,
  WrapExistingCtorSpec,
  AugmentedGgbApi,
} from "../shared";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

import { registerObjectType } from "../type-registry";

declare var Sk: SkulptApi;

interface SkGgbLine extends SkGgbObject {}

type SkGgbLineCtorSpec =
  | WrapExistingCtorSpec
  | { kind: "point-point"; points: Array<SkGgbObject> }
  | { kind: "coefficients"; coeffs: [SkObject, SkObject] };

export const register = (mod: any, appApi: AppApi) => {
  const ggb: AugmentedGgbApi = augmentedGgbApi(appApi.ggb);
  const skApi = appApi.sk;

  const cls = Sk.abstr.buildNativeClass("Line", {
    constructor: function Line(this: SkGgbLine, spec: SkGgbLineCtorSpec) {
      const setLabelCmd = setGgbLabelFromCmd(ggb, this);
      const setLabelArgs = setGgbLabelFromArgs(ggb, this, "Line");

      switch (spec.kind) {
        case "wrap-existing": {
          this.$ggbLabel = spec.label;
          this.$updateHandlers = [];
          this.$clickHandlers = [];
          ggb.registerObjectUpdateListener(this.$ggbLabel, () =>
            this.$fireUpdateEvents()
          );
          ggb.registerObjectClickListener(this.$ggbLabel, () =>
            this.$fireClickEvents()
          );
          return;
        }
        case "point-point": {
          setLabelArgs(spec.points.map((p) => p.$ggbLabel));
          return;
        }
        case "coefficients": {
          const ggbCoeffs = spec.coeffs.map(ggb.numberValueOrLabel);
          setLabelCmd(`y=(${ggbCoeffs[0]})x + (${ggbCoeffs[1]})`);
          return;
        }
        default:
          throw new Sk.builtin.RuntimeError(
            `bad Line spec kind "${(spec as any).kind}"`
          );
      }
    },
    slots: {
      tp$new(args, kwargs) {
        const badArgsError = new Sk.builtin.TypeError(
          "Line() arguments must be (point, point) or (slope, intercept)"
        );

        const make = (spec: SkGgbLineCtorSpec) =>
          withPropertiesFromNameValuePairs(new mod.Line(spec), kwargs);

        switch (args.length) {
          case 2: {
            if (ggb.everyElementIsGgbObjectOfType(args, "point")) {
              return make({ kind: "point-point", points: args });
            }

            if (args.every(ggb.isPythonOrGgbNumber)) {
              // We know that args is a two-element array of SkObjects,
              // but TypeScript can't yet work that out.
              return make({
                kind: "coefficients",
                coeffs: args as [SkObject, SkObject],
              });
            }

            throw badArgsError;
          }
          default:
            throw badArgsError;
        }
      },
    },
    methods: {
      when_moved: {
        $meth(this: SkGgbLine, pyFun: any) {
          this.$updateHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
      when_clicked: {
        $meth(this: SkGgbLine, pyFun: any) {
          this.$clickHandlers.push(pyFun);
          return pyFun;
        },
        $flags: { OneArg: true },
      },
      ...ggb.freeCopyMethodsSlice,
    },
    getsets: {
      is_visible: ggb.sharedGetSets.is_visible,
      color: ggb.sharedGetSets.color,
      color_floats: ggb.sharedGetSets.color_floats,
      line_thickness: ggb.sharedGetSets.line_thickness,
      caption: ggb.sharedGetSets.caption,
      _ggb_type: ggb.sharedGetSets._ggb_type,
      _ggb_exists: ggb.sharedGetSets._ggb_exists,
    },
    proto: {
      $fireUpdateEvents(this: SkGgbLine) {
        this.$updateHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            skApi.onError(e as any);
          }
        });
      },
      $fireClickEvents(this: SkGgbLine) {
        this.$clickHandlers.forEach((fun) => {
          try {
            Sk.misceval.callsimOrSuspend(fun);
          } catch (e) {
            skApi.onError(e as any);
          }
        });
      },
    },
  });

  mod.Line = cls;
  registerObjectType("line", cls);
};
