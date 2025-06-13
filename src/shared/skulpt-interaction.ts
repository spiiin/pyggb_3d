import { SkulptInteractionApi, AppApi, UiApi, HidApi } from "./appApi";
import { GgbApi } from "./vendor-types/ggbapi";
import { RunControlClient } from "../wrap-ggb/interruptible-sleep";
import {
  SkBaseException,
  SkulptApi,
  augmentedSkulptApi,
} from "./vendor-types/skulptapi";

declare var Sk: SkulptApi;

export type ModuleFilename = string;
export type ModuleContents = string;
export type LocalModules = Map<ModuleFilename, ModuleContents>;

export const messageOfPyError = (err: SkBaseException) => {
  if (err.tp$name == null) {
    return `[Internal error: ${err}]`;
  }

  let message = err.tp$name;
  if (err.args && err.args.v.length > 0) {
    const arg0 = err.args.v[0];
    const extra = augmentedSkulptApi.checkString(arg0)
      ? arg0.v
      : "(no more information)";
    message += ": " + extra;
  }

  return message;
};

const builtinOrLocalRead =
  (localModules: LocalModules) => (filename: string) => {
    if (
      Sk.builtinFiles !== undefined &&
      Sk.builtinFiles["files"][filename] !== undefined
    )
      return Sk.builtinFiles["files"][filename];

    if (localModules.has(filename)) return localModules.get(filename);

    throw new Error(`File not found: "${filename}"`);
  };

export interface StdoutActions {
  clear: () => void;
  append: (newOutput: string) => void;
}

export interface ErrorActions {
  clear: () => void;
  append: (newError: SkBaseException) => void;
}

export const runPythonProgram = (
  userCodeText: string,
  localModules: LocalModules,
  stdoutActions: StdoutActions,
  errorActions: ErrorActions,
  hidApi: HidApi,
  runControlClient: RunControlClient,
  ggbApi: GgbApi
) => {
  Sk.configure({
    output: stdoutActions.append,
    read: builtinOrLocalRead(localModules),
    __future__: Sk.python3,
    inputfun: (promptText: string) => prompt(promptText),
    inputfunTakesPrompt: true /* then you need to output the prompt yourself */,
  });

  stdoutActions.clear();
  errorActions.clear();
  ggbApi.reset();
  ggbApi.newConstruction(); //remove old objects
  ggbApi.setPerspective("T");
  hidApi.clearRegistration();

  // TODO: Seems a bit clunky to reuse errorActions and stdoutActions
  // like this.  Revisit?
  const skApi: SkulptInteractionApi = {
    onError: (e) => errorActions.append(e),
  };
  const uiApi: UiApi = {
    clearConsole: () => stdoutActions.clear(),
    runControlClient: runControlClient,
  };
  const appApi: AppApi = { ggb: ggbApi, sk: skApi, ui: uiApi, hid: hidApi };
  (globalThis as any).$appApiHandoverQueue.enqueue(appApi);

  const handleError = (e: any) => errorActions.append(e);

  const codePreambleLines = [
    "from ggb import *",
    "import time",
    "time.sleep = interruptible_sleep",
    "del time",
    "# Invisible versions of wrapper methods",
    "def Invisible(obj):",
    "    obj.is_visible = False",
    "    return obj",
    "def CrossI(*args, **kwargs):",
    "    return Cross(*args, is_visible=False, **kwargs)",
    "def ClosestPointI(*args, **kwargs):",
    "    return ClosestPoint(*args, is_visible=False, **kwargs)",
    "def MidpointI(*args, **kwargs):",
    "    return Midpoint(*args, is_visible=False, **kwargs)",
    "def UnitVectorI(*args, **kwargs):",
    "    return UnitVector(*args, is_visible=False, **kwargs)",
    "def CentroidI(*args, **kwargs):",
    "    return Centroid(*args, is_visible=False, **kwargs)",
    "def PointI(*args, **kwargs):",
    "    return Point(*args, is_visible=False, **kwargs)",
    "def LineI(*args, **kwargs):",
    "    return Line(*args, is_visible=False, **kwargs)",
    "def CircleI(*args, **kwargs):",
    "    return Circle(*args, is_visible=False, **kwargs)",
    "def VectorI(*args, **kwargs):",
    "    return Vector(*args, is_visible=False, **kwargs)",
    "def PolygonI(*args, **kwargs):",
    "    return Polygon(*args, is_visible=False, **kwargs)",
    "def SegmentI(*args, **kwargs):",
    "    return Segment(*args, is_visible=False, **kwargs)",
    "def RayI(*args, **kwargs):",
    "    return Ray(*args, is_visible=False, **kwargs)",
    "def AngleI(*args, **kwargs):",
    "    return Angle(*args, is_visible=False, **kwargs)",
    "def ArcI(*args, **kwargs):",
    "    return Arc(*args, is_visible=False, **kwargs)",
    "def ConicI(*args, **kwargs):",
    "    return Conic(*args, is_visible=False, **kwargs)",
    "def LocusI(*args, **kwargs):",
    "    return Locus(*args, is_visible=False, **kwargs)",
    "def TextI(*args, **kwargs):",
    "    return Text(*args, is_visible=False, **kwargs)",
    "def ImageI(*args, **kwargs):",
    "    return Image(*args, is_visible=False, **kwargs)",
    "def CheckboxI(*args, **kwargs):",
    "    return Checkbox(*args, is_visible=False, **kwargs)",
    "def ButtonI(*args, **kwargs):",
    "    return Button(*args, is_visible=False, **kwargs)",
    "def InputBoxI(*args, **kwargs):",
    "    return InputBox(*args, is_visible=False, **kwargs)",
    "def SliderI(*args, **kwargs):",
    "    return Slider(*args, is_visible=False, **kwargs)",
    "def ListI(*args, **kwargs):",
    "    return List(*args, is_visible=False, **kwargs)",
    "def TableI(*args, **kwargs):",
    "    return Table(*args, is_visible=False, **kwargs)",
    "def SpreadsheetI(*args, **kwargs):",
    "    return Spreadsheet(*args, is_visible=False, **kwargs)",
    "def FunctionI(*args, **kwargs):",
    "    return Function(*args, is_visible=False, **kwargs)",
    "def CurveI(*args, **kwargs):",
    "    return Curve(*args, is_visible=False, **kwargs)",
    "def ParametricCurveI(*args, **kwargs):",
    "    return ParametricCurve(*args, is_visible=False, **kwargs)",
    "def ImplicitCurveI(*args, **kwargs):",
    "    return ImplicitCurve(*args, is_visible=False, **kwargs)",
    "def InequalityI(*args, **kwargs):",
    "    return Inequality(*args, is_visible=False, **kwargs)",
    "def RegionI(*args, **kwargs):",
    "    return Region(*args, is_visible=False, **kwargs)",
    "def IntegralI(*args, **kwargs):",
    "    return Integral(*args, is_visible=False, **kwargs)",
    "def SumI(*args, **kwargs):",
    "    return Sum(*args, is_visible=False, **kwargs)",
    "def ProductI(*args, **kwargs):",
    "    return Product(*args, is_visible=False, **kwargs)",
    "def DerivativeI(*args, **kwargs):",
    "    return Derivative(*args, is_visible=False, **kwargs)",
    "def RootI(*args, **kwargs):",
    "    return Root(*args, is_visible=False, **kwargs)",
    "def ExtremumI(*args, **kwargs):",
    "    return Extremum(*args, is_visible=False, **kwargs)",
    "def InflectionPointI(*args, **kwargs):",
    "    return InflectionPoint(*args, is_visible=False, **kwargs)",
    "def AsymptoteI(*args, **kwargs):",
    "    return Asymptote(*args, is_visible=False, **kwargs)",
    "def TangentI(*args, **kwargs):",
    "    return Tangent(*args, is_visible=False, **kwargs)",
    "def NormalI(*args, **kwargs):",
    "    return Normal(*args, is_visible=False, **kwargs)",
    "def ConicI(*args, **kwargs):",
    "    return Conic(*args, is_visible=False, **kwargs)",
    "def ParabolaI(*args, **kwargs):",
    "    return Parabola(*args, is_visible=False, **kwargs)",
    "def HyperbolaI(*args, **kwargs):",
    "    return Hyperbola(*args, is_visible=False, **kwargs)",
    "def EllipseI(*args, **kwargs):",
    "    return Ellipse(*args, is_visible=False, **kwargs)",
    "def CircleI(*args, **kwargs):",
    "    return Circle(*args, is_visible=False, **kwargs)",
    "def ArcI(*args, **kwargs):",
    "    return Arc(*args, is_visible=False, **kwargs)",
    "def SectorI(*args, **kwargs):",
    "    return Sector(*args, is_visible=False, **kwargs)",
    "def CircumcircularArcI(*args, **kwargs):",
    "    return CircumcircularArc(*args, is_visible=False, **kwargs)",
    "def CircumcircularSectorI(*args, **kwargs):",
    "    return CircumcircularSector(*args, is_visible=False, **kwargs)",
    "def SemicircleI(*args, **kwargs):",
    "    return Semicircle(*args, is_visible=False, **kwargs)",
    "def CircularArcI(*args, **kwargs):",
    "    return CircularArc(*args, is_visible=False, **kwargs)",
    "def CircularSectorI(*args, **kwargs):",
    "    return CircularSector(*args, is_visible=False, **kwargs)",
    "def CircularSegmentI(*args, **kwargs):",
    "    return CircularSegment(*args, is_visible=False, **kwargs)",
    "def CircularArcThreePointsI(*args, **kwargs):",
    "    return CircularArcThreePoints(*args, is_visible=False, **kwargs)",
    "def CircularSectorThreePointsI(*args, **kwargs):",
    "    return CircularSectorThreePoints(*args, is_visible=False, **kwargs)",
    "def CircularSegmentThreePointsI(*args, **kwargs):",
    "    return CircularSegmentThreePoints(*args, is_visible=False, **kwargs)",
    "def CircularArcThreePointsI(*args, **kwargs):",
    "    return CircularArcThreePoints(*args, is_visible=False, **kwargs)",
    "def CircularSectorThreePointsI(*args, **kwargs):",
    "    return CircularSectorThreePoints(*args, is_visible=False, **kwargs)",
    "def CircularSegmentThreePointsI(*args, **kwargs):",
    "    return CircularSegmentThreePoints(*args, is_visible=False, **kwargs)",
  ];
  const codePreamble = codePreambleLines.join("\n") + "\n";
  const codeText = codePreamble + userCodeText;

  return Sk.misceval
    .asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, codeText, true)
    )
    .catch(handleError);
};
