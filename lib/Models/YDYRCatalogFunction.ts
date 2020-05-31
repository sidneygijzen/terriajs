import { computed } from "mobx";
import YDYRCatalogFunctionTraits from "../Traits/YDYRCatalogFunctionTraits";
import CreateModel from "./CreateModel";
import FunctionParameter from "./FunctionParameters/FunctionParameter";
import CatalogFunctionMixin from "../ModelMixins/CatalogFunctionMixin";
import EnumerationParameter from "./FunctionParameters/EnumerationParameter";
import TableMixin from "../ModelMixins/TableMixin";
import isDefined from "../Core/isDefined";
import TableColumnType from "../Table/TableColumnType";
import BooleanParameter from "./FunctionParameters/BooleanParameter";
import YDYRCatalogFunctionJob from "./YDYRCatalogFunctionJob";
import filterOutUndefined from "../Core/filterOutUndefined";
import InfoParameter from "./FunctionParameters/InfoParameter";
import StringParameter from "./FunctionParameters/StringParameter";

export const DATASETS = [
  {
    title: "ABS - 2011 Statistical Areas Level 1",
    filename: "SA1_2011_AUST",
    dataCol: "SA1_MAIN11",
    geographyName: "SA1_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Statistical Areas Level 2",
    filename: "SA2_2011_AUST",
    dataCol: "SA2_MAIN11",
    geographyName: "SA2_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Statistical Areas Level 3",
    filename: "SA3_2011_AUST",
    dataCol: "SA3_CODE11",
    geographyName: "SA3_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Statistical Areas Level 4",
    filename: "SA4_2011_AUST",
    dataCol: "SA4_CODE11",
    geographyName: "SA4_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Local Government Areas",
    filename: "LGA_2011_AUST",
    dataCol: "LGA_CODE11",
    geographyName: "LGA_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Commonwealth Electoral Divisions",
    filename: "CED_2011_AUST",
    dataCol: "CED_CODE11",
    geographyName: "CED_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 State Electoral Divisions",
    filename: "SED_2011_AUST",
    dataCol: "SED_CODE11",
    geographyName: "SED_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Remoteness Areas 2011",
    filename: "RA_2011_AUST",
    dataCol: "RA_CODE11",
    geographyName: "RA_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 State Suburbs",
    filename: "SSC_2011_AUST",
    dataCol: "SSC_CODE11",
    geographyName: "SSC_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2011 Postal Areas",
    filename: "POA_2011_AUST",
    dataCol: "POA_CODE",
    geographyName: "POA_2011",
    sideData: "BCP_2011"
  },
  {
    title: "ABS - 2016 Statistical Areas Level 1",
    filename: "SA1_2016_AUST",
    dataCol: "SA1_MAIN16",
    geographyName: "SA1_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Statistical Areas Level 2",
    filename: "SA2_2016_AUST",
    dataCol: "SA2_MAIN16",
    geographyName: "SA2_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Statistical Areas Level 3",
    filename: "SA3_2016_AUST",
    dataCol: "SA3_CODE16",
    geographyName: "SA3_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Statistical Areas Level 4",
    filename: "SA4_2016_AUST",
    dataCol: "SA4_CODE16",
    geographyName: "SA4_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Local Government Areas",
    filename: "LGA_2016_AUST",
    dataCol: "LGA_CODE16",
    geographyName: "LGA_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Commonwealth Electoral Divisions",
    filename: "CED_2016_AUST",
    dataCol: "CED_CODE16",
    geographyName: "CED_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 State Electoral Divisions",
    filename: "SED_2016_AUST",
    dataCol: "SED_CODE16",
    geographyName: "SED_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - Remoteness Areas 2016",
    filename: "RA_2016_AUST",
    dataCol: "RA_CODE16",
    geographyName: "RA_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 State Suburbs",
    filename: "SSC_2016_AUST",
    dataCol: "SSC_CODE16",
    geographyName: "SSC_2016",
    sideData: "BCP_2016"
  },
  {
    title: "ABS - 2016 Postal Areas",
    filename: "POA_2016_AUST",
    dataCol: "POA_CODE16",
    geographyName: "POA_2016",
    sideData: "BCP_2016"
  }
];

export const SIDE_DATA = [
  { title: "Basic Community profile 2011", id: "BCP_2011" },
  { title: "Basic Community profile 2016", id: "BCP_2016" }
];

export const ALGORITHMS: [string, boolean][] = [
  ["Negative Binomial", true],
  ["Population Weighted", false]
  // ["Poisson Linear", false],
  // ["Ridge Regressor", false]
];

export default class YDYRCatalogFunction extends CatalogFunctionMixin(
  CreateModel(YDYRCatalogFunctionTraits)
) {
  static readonly type = "ydyr";
  readonly jobType = YDYRCatalogFunctionJob.type;

  readonly typeName = "YourDataYourRegions";

  private _inputLayers?: EnumerationParameter;
  private _dataColumn?: EnumerationParameter;
  private _regionColumn?: EnumerationParameter;

  protected async createJob(id: string) {
    return new YDYRCatalogFunctionJob(id, this.terria);
  }

  async forceLoadMetadata() {}

  @computed
  get description() {
    return `Your Data Your Regions (YDYR) is an API for the conversion of data between different Australian geographic boundaries. See <a href="https://ydyr.info">ydyr.info</a> for more information`;
  }

  @computed
  get selectedTableCatalogMember(): TableMixin.TableMixin | undefined {
    if (!isDefined(this.inputLayers?.value)) {
      return;
    }
    const layer = this.terria.workbench.items
      .filter(TableMixin.isMixedInto)
      .filter(item => item.uniqueId === this.inputLayers!.value)[0];

    return layer;
  }

  @computed
  get apiUrl(): StringParameter {
    return new StringParameter(this, {
      id: "apiUrl",
      name: "YDYR API Endpoint",
      isRequired: true
    });
  }

  @computed
  get inputLayers() {
    const possibleValues = this.terria.workbench.items
      .filter(
        item =>
          TableMixin.isMixedInto(item) && item.activeTableStyle.isRegions()
      )
      .map(item => item.uniqueId)
      .filter(isDefined);

    this._inputLayers = new EnumerationParameter(this, {
      id: "Input Layer",
      possibleValues,

      isRequired: true
    });
    return this._inputLayers;
  }

  @computed
  get inputLayersInfo() {
    let value = "";

    if (isDefined(this.inputLayers.value) && !this.inputLayers.isValid) {
      value = `The selected layer "${this.inputLayers.value} does not exist in the Workbench". `;
    }

    if (this.inputLayers.possibleValues.length === 0) {
      value = `No input layers available, please add a tabular data layer to the Workbench (for example - CSV). `;
    }

    if (value !== "") {
      return new InfoParameter(this, {
        id: "inputLayersError",
        name: "Input Layer Error",
        errorMessage: true,
        value
      });
    }
  }

  @computed
  get regionColumn(): EnumerationParameter | undefined {
    if (!this.inputLayers.isValid) {
      return;
    }
    const possibleValues =
      this.selectedTableCatalogMember?.tableColumns
        // Filter region columns which use supported regions
        .filter(
          col =>
            col.type === TableColumnType.region &&
            isDefined(
              DATASETS.find(d => d.dataCol === col.regionType?.regionProp)
            )
        )
        .map(col => col.name) || [];

    this._regionColumn = new EnumerationParameter(this, {
      id: "Region Column",
      possibleValues,

      isRequired: true
    });
    return this._regionColumn;
  }

  @computed
  get regionColumnInfo() {
    if (
      this.inputLayers.isValid &&
      this.regionColumn?.possibleValues.length === 0
    ) {
      return new InfoParameter(this, {
        id: "regionColumnError",
        name: "Region Column Error",
        errorMessage: true,
        value: `No region columns available, the selected layer "${this.inputLayers.value}" doesn't have any supported region columns. The region mapping can be set in the Workbench.`
      });
    }
  }

  @computed
  get dataColumn(): EnumerationParameter | undefined {
    if (!this.inputLayers.isValid) {
      return;
    }
    const possibleValues =
      this.selectedTableCatalogMember?.tableColumns
        .filter(col => col.type === TableColumnType.scalar)
        .map(col => col.name) || [];
    if (possibleValues.length === 0) {
    }
    this._dataColumn = new EnumerationParameter(this, {
      id: "Data Column",
      possibleValues,
      isRequired: true
    });
    return this._dataColumn;
  }

  @computed
  get dataColumnInfo() {
    if (
      this.inputLayers.isValid &&
      this.dataColumn?.possibleValues.length === 0
    ) {
      return new InfoParameter(this, {
        id: "dataColumnError",
        name: "Data Column Error",
        errorMessage: true,
        value: `No data columns available, the selected layer "${this.inputLayers.value}" doesn't have any numerical columns.`
      });
    }
  }

  @computed get availableRegions(): EnumerationParameter | undefined {
    if (!this.regionColumn?.isValid) {
      return;
    }
    return new EnumerationParameter(this, {
      id: "Output Geography",
      possibleValues: DATASETS.map(d => d.title),
      isRequired: true
    });
  }

  @computed get algorithmParametersInfo(): InfoParameter | undefined {
    if (this.algorithmParameters.length > 0) {
      return new InfoParameter(this, {
        id: "algorithmsInfo",
        name: "Select Algorithms",
        value: `Predictive models used to convert data between the input and output geographies:`
      });
    }
  }

  @computed get algorithmParameters(): BooleanParameter[] {
    if (
      !this.regionColumn?.isValid ||
      !this.dataColumn?.isValid ||
      !this.availableRegions?.isValid
    ) {
      return [];
    }
    return ALGORITHMS.map(
      alg =>
        new BooleanParameter(this, {
          id: alg[0]
        })
    );
  }

  @computed get submitWarning(): InfoParameter | undefined {
    if (
      this.inputLayers.isValid &&
      this.regionColumn?.isValid &&
      this.dataColumn?.isValid &&
      this.availableRegions?.isValid
    ) {
      return new InfoParameter(this, {
        id: "dataWarning",
        name: "Warning",
        errorMessage: false,
        value: `By submitting this form your tabular data will be sent to ${this.apiUrl.value} for processing.`
      });
    }
  }

  // @computed get sidedataParameters(): EnumerationParameter {
  //   const possibleValues = SIDE_DATA.map(data => data.title);
  //   let value = possibleValues[0]
  //   if (isDefined(this.availableRegions.value)) {

  //   }
  //   return new EnumerationParameter({
  //     id: "Side data",
  //     possibleValues,
  //     value: possibleValues[0]
  //   });
  // }

  /**
   *  Maps the input to function parameters.
   */
  @computed
  get functionParameters(): FunctionParameter[] {
    return filterOutUndefined([
      this.apiUrl,

      this.inputLayersInfo || this.inputLayers,
      this.regionColumnInfo || this.regionColumn,

      this.dataColumnInfo || this.dataColumn,

      this.availableRegions,
      this.algorithmParametersInfo,
      ...this.algorithmParameters,
      this.submitWarning
      // this.sidedataParameters
    ]);
  }
}
