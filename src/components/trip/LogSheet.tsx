import React, { useState } from "react";

const DriversLogSheet: React.FC = () => {
  const [logData, setLogData] = useState({
    // Top section fields
    fromDate: "",
    toDate: "",
    totalMilesDriving: "",
    totalMileage: "",
    truckNumber: "",
    licenseState: "",

    // Carrier information
    carrierName: "",
    mainOfficeAddress: "",
    homeTerminalAddress: "",

    // Time grid data
    timeEntries: Array(24 * 4).fill(null), // 24 hours, 4 quarter-hours per hour

    // Bottom section fields
    remarks: "",
    shippingDocuments: "",
    shipperCommodity: "",
    recapFields: {
      onDutyHoursToday: "",
      totalHoursToday: "",
      totalHoursLast7Days: "",
    },
  });

  // Render time grid with quarter-hour increments
  const renderTimeGrid = () => {
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={12} className="border text-center">
              Midnight
            </th>
            <th colSpan={12} className="border text-center">
              Noon
            </th>
            <th colSpan={12} className="border text-center">
              Midnight
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            "Off Duty",
            "Sleeper Berth",
            "Driving",
            "On Duty (not driving)",
          ].map((status, rowIndex) => (
            <tr key={status}>
              <td className="border p-1 text-xs w-24">{status}</td>
              {Array(48)
                .fill(null)
                .map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="border w-4 h-8"
                    style={{
                      backgroundColor:
                        logData.timeEntries[colIndex] === rowIndex
                          ? getStatusColor(rowIndex)
                          : "white",
                    }}
                    onClick={() => handleTimeGridClick(rowIndex, colIndex)}
                  />
                ))}
              <td className="border w-12"></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const getStatusColor = (statusIndex: number) => {
    const colors = [
      "lightgray", // Off Duty
      "gray", // Sleeper Berth
      "blue", // Driving
      "green", // On Duty
    ];
    return colors[statusIndex];
  };

  const handleTimeGridClick = (rowIndex: number, colIndex: number) => {
    const newTimeEntries = [...logData.timeEntries];
    newTimeEntries[colIndex] =
      newTimeEntries[colIndex] === rowIndex ? null : rowIndex;
    setLogData((prevState) => ({
      ...prevState,
      timeEntries: newTimeEntries,
    }));
  };

  return (
    <div className="p-4 bg-white border shadow-lg max-w-4xl mx-auto">
      <h1 className="text-center font-bold text-lg mb-4">Driver's Daily Log</h1>

      {/* Top Information Section */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs mb-1">From:</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.fromDate}
            onChange={(e) =>
              setLogData((prev) => ({ ...prev, fromDate: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs mb-1">To:</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.toDate}
            onChange={(e) =>
              setLogData((prev) => ({ ...prev, toDate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Mileage and Vehicle Information */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div>
          <label className="block text-xs">Total Miles Driving Today</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.totalMilesDriving}
            onChange={(e) =>
              setLogData((prev) => ({
                ...prev,
                totalMilesDriving: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Total Mileage Today</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.totalMileage}
            onChange={(e) =>
              setLogData((prev) => ({ ...prev, totalMileage: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Truck/Tractor No.</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.truckNumber}
            onChange={(e) =>
              setLogData((prev) => ({ ...prev, truckNumber: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">License State</label>
          <input
            type="text"
            className="w-full border p-1 text-xs"
            value={logData.licenseState}
            onChange={(e) =>
              setLogData((prev) => ({ ...prev, licenseState: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Time Grid */}
      <div className="mb-4">{renderTimeGrid()}</div>

      {/* Remarks Section */}
      <div className="mb-4">
        <label className="block text-xs mb-1">Remarks:</label>
        <textarea
          className="w-full border p-1 text-xs h-24"
          value={logData.remarks}
          onChange={(e) =>
            setLogData((prev) => ({ ...prev, remarks: e.target.value }))
          }
        />
      </div>

      {/* Shipping Documents */}
      <div className="mb-4">
        <label className="block text-xs mb-1">Shipping Documents:</label>
        <input
          type="text"
          className="w-full border p-1 text-xs"
          value={logData.shippingDocuments}
          onChange={(e) =>
            setLogData((prev) => ({
              ...prev,
              shippingDocuments: e.target.value,
            }))
          }
        />
      </div>

      {/* Recap Section */}
      <div className="border p-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs">70 Hour/8 Day Recap</label>
            <div className="grid grid-cols-2 gap-1">
              <input
                type="text"
                placeholder="On Duty Hours"
                className="border p-1 text-xs"
                value={logData.recapFields.onDutyHoursToday}
                onChange={(e) =>
                  setLogData((prev) => ({
                    ...prev,
                    recapFields: {
                      ...prev.recapFields,
                      onDutyHoursToday: e.target.value,
                    },
                  }))
                }
              />
              <input
                type="text"
                placeholder="Total Hours"
                className="border p-1 text-xs"
                value={logData.recapFields.totalHoursToday}
                onChange={(e) =>
                  setLogData((prev) => ({
                    ...prev,
                    recapFields: {
                      ...prev.recapFields,
                      totalHoursToday: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs">60 Hour/7 Day Drivers</label>
            <div className="grid grid-cols-2 gap-1">
              <input type="text" className="border p-1 text-xs" />
              <input type="text" className="border p-1 text-xs" />
            </div>
          </div>
          <div>
            <label className="block text-xs">Total Hours</label>
            <input
              type="text"
              className="w-full border p-1 text-xs"
              value={logData.recapFields.totalHoursLast7Days}
              onChange={(e) =>
                setLogData((prev) => ({
                  ...prev,
                  recapFields: {
                    ...prev.recapFields,
                    totalHoursLast7Days: e.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversLogSheet;
