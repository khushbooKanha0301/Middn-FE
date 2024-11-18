// import React, { useEffect, useState, useRef } from "react";

// function MarketPlaceStepper() {
//   const items = {
//     view: "vertical",
//     data: [
//       {
//         classes: ["stepper-active"],
//         isActive: true,
//         isDisabled: false,
//         iconProps: {
//           name: "",
//           template: "",
//           tooltipProps: {},
//           classes: []
//         },
//         labelProps: {
//           name: "Step -1",
//           ariaLabel: "",
//           tooltipProps: {},
//           template: "",
//           classes: []
//         },
//         bodyProps: {
//           description: "Step -1 description",
//           ariaLabel: "",
//           template: (
//             <>
//               <span>Step -1 description - template </span>
//               <p>First template</p>
//             </>
//           ),
//           classes: []
//         },
//         buttonProps: {
//           template: "",
//           classes: [],
//           data: [
//             {
//               type: "link",
//               name: "Next",
//               ariaLabel: "Next",
//               classes: [],
//               clickHandler: "Next"
//             }
//           ]
//         }
//       },

//       {
//         classes: [],
//         isActive: false,
//         isDisabled: true,
//         iconProps: {
//           name: "",
//           template: "",
//           tooltipProps: {},
//           classes: []
//         },
//         labelProps: {
//           name: "Step-2",
//           ariaLabel: "",
//           tooltipProps: {},
//           template: "",
//           classes: []
//         },
//         bodyProps: {
//           description: "Step -2 description",
//           ariaLabel: "",
//           template: "",
//           classes: []
//         },

//         buttonProps: {
//           template: "",
//           classes: [],
//           data: [
//             {
//               type: "link",
//               name: "Previous",
//               classes: [],
//               ariaLabel: "Previous",
//               clickHandler: "Previous"
//             },
//             {
//               type: "link",
//               name: "Next",
//               classes: [],
//               ariaLabel: "Next",
//               clickHandler: "Next"
//             }
//           ]
//         }
//       },
//       {
//         classes: [],
//         isActive: false,
//         isDisabled: true,
//         iconProps: {
//           name: "",
//           template: "",
//           tooltipProps: {},
//           classes: []
//         },
//         labelProps: {
//           name: "Step-3",
//           ariaLabel: "",
//           tooltipProps: {},
//           template: "",
//           classes: []
//         },
//         bodyProps: {
//           description: "Step -3 description",
//           ariaLabel: "",
//           template: "",
//           classes: []
//         },

//         buttonProps: {
//           template: "",
//           classes: [],
//           data: [
//             {
//               type: "link",
//               name: "Previous",
//               classes: [],
//               ariaLabel: "Previous",
//               clickHandler: "Previous"
//             },
//             {
//               type: "link",
//               name: "Next",
//               classes: [],
//               ariaLabel: "Next",
//               clickHandler: "Next"
//             }
//           ]
//         }
//       },
//     ]
//   };
//   const [StepperItems, setStepperItems] = useState({ ...items });

//   const _generateItemIcon = (rowProps, index) => {
//     const iconProps = { ...rowProps.iconProps };
//     const iconContext = [];
//     if (iconProps.template !== "") {
//       iconContext.push(iconProps.template);
//     } else {
//       iconContext.push(<span className="icon">{index}</span>);
//     }
//     return iconContext;
//   };

//   const _generateItemLable = (rowProps) => {
//     const labelProps = { ...rowProps.labelProps };
//     const labelContext = [];
//     if (labelProps.template !== "") {
//       labelContext.push(labelProps.template);
//     } else {
//       labelContext.push(
//         <label
//           aria-label={
//             labelProps.ariaLabel !== "" ? labelProps.ariaLabel : labelProps.name
//           }
//         >
//           {labelProps.name}
//         </label>
//       );
//     }
//     return labelContext;
//   };

//   const _generateItemBody = (rowProps) => {
//     const bodyProps = { ...rowProps.bodyProps };
//     const bodyContext = [];
//     if (bodyProps.template !== "") {
//       bodyContext.push(bodyProps.template);
//     } else {
//       bodyContext.push(
//         <>
//           <span
//             aria-label={
//               bodyProps.ariaLabel !== ""
//                 ? bodyProps.ariaLabel
//                 : bodyProps.description
//             }
//           >
//             {bodyProps.description}
//           </span>
//           <p></p>
//         </>
//       );
//     }
//     return bodyContext;
//   };

//   const _goNext = (index) => {
//     let SItems = StepperItems;

//     let SItemsData = [...SItems.data];
//     SItemsData = SItemsData.map((row, i) => {
//       if (i == index) {
//         return {
//           ...row,
//           isActive: false
//         };
//       } else if (i == index + 1) {
//         let classes = [...row.classes];
//         classes.push("stepper-active");

//         return {
//           ...row,
//           classes: [...classes],
//           isActive: true,
//           isDisabled: false
//         };
//       } else return row;
//     });
//     SItems = {
//       ...SItems,
//       data: [...SItemsData]
//     };
//     setStepperItems(SItems);
//   };

//   const _goPrevious = (index) => {
//     let SItems = StepperItems;
//     let SItemsData = [...SItems.data];
//     SItemsData = SItemsData.map((row, i) => {
//       if (i >= index) {
//         let classes = [...row.classes];
//         classes.pop("stepper-active");

//         return {
//           ...row,
//           classes: [...classes],
//           isActive: false,
//           isDisabled: true
//         };
//       } else if (i == index - 1) {
//         return {
//           ...row,
//           isActive: true,
//           isDisabled: false
//         };
//       } else return row;
//     });
//     SItems = {
//       ...SItems,
//       data: [...SItemsData]
//     };
//     setStepperItems(SItems);
//   };

//   const _buttonActions = (type, value) => {
//     switch (type) {
//       case "Previous":
//         _goPrevious(value);
//         break;
//       default:
//         _goNext(value);
//         break;
//     }
//   };

//   const _generateButtons = (rowProps, index) => {
//     const buttonProps = { ...rowProps.buttonProps };
//     const buttonContext = [];
//     if (rowProps.isActive) {
//       if (buttonProps.template !== "") {
//         buttonContext.push(buttonProps.template);
//       } else {
//         buttonProps.data.map((btrow, btindex) => {
//           switch (btrow.type) {
//             case "link":
//               buttonContext.push(
//                 <button
//                   className="stepper-btn"
//                   aria-label={
//                     btrow.ariaLabel !== "" ? btrow.ariaLabel : btrow.name
//                   }
//                   onClick={() => _buttonActions(btrow.clickHandler, index)}
//                 >
//                   {btrow.name}
//                 </button>
//               );
//               break;
//             default:
//               buttonContext.push(
//                 <button
//                   className="stepper-btn"
//                   aria-label={
//                     btrow.ariaLabel !== "" ? btrow.ariaLabel : btrow.name
//                   }
//                   onClick={() => _buttonActions(btrow.clickHandler, index)}
//                 >
//                   {btrow.name}
//                 </button>
//               );
//               break;
//           }
//         });
//       }
//     }

//     return buttonContext;
//   };

//   const _generateStepper = (StepperItems) => {
//     const data = [...StepperItems.data];
//     let itemsObj = [];
//     data.map((row, index) => {
//       const itemDisabled = row.isDisabled ? "disabledClass" : "";
//       let itemObj = (
//         <div
//           className={"stepper-item " + itemDisabled + row.classes.join(" ")}
//           key={index}
//           disabled={row.isDisabled}
//         >
//           <div className="stepper-icon-container">
//             <div className={"stepper-icon " + row.iconProps.classes.join(" ")}>
//               {_generateItemIcon(row, index + 1)}
//             </div>
//             <div
//               className={
//                 "stepper-icon-label " + row.labelProps.classes.join(" ")
//               }
//             >
//               {_generateItemLable(row)}
//             </div>
//           </div>
//           <div
//             className={"stepper-item-body " + row.bodyProps.classes.join(" ")}
//           >
//             {_generateItemBody(row)}

//             <div className="stepper-btn-container">
//               {_generateButtons(row, index)}
//             </div>
//           </div>
//         </div>
//       );

//       itemsObj.push(itemObj);
//     });

//     return itemsObj;
//   };

//   return (
//     <div className="container">
//       <div className="stepper-container">{_generateStepper(StepperItems)}</div>
//     </div>
//   );
// }

// export default MarketPlaceStepper;
import React, { useState } from "react";

const steps = [
  {
    label: "Step 1",
    content: "This is the content for Step 1.",
  },
  {
    label: "Step 2",
    content: "This is the content for Step 2.",
  },
  {
    label: "Step 3",
    content: "This is the content for Step 3.",
  },
  {
    label: "Step 4",
    content: "This is the content for Step 4.",
  },
];

const MarketPlaceStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleStepClick = (index) => {
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div
          className={`step ${index <= activeStep ? "active" : ""}`}
          key={index}
          onClick={() => handleStepClick(index)}
        >
          <div className="step-label">{step.label}</div>
          {index <= activeStep && (
            <div className="step-content">{step.content}</div>
          )}
        </div>
      ))}

      {activeStep < steps.length - 1 && (
        <button onClick={handleNextStep}>Next</button>
      )}
    </div>
  );
};

export default MarketPlaceStepper;
