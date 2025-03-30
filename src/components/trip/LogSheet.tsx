import React, { useState, useEffect } from "react";
import { createTripLog } from "../../services/api";
import { toast } from "react-toastify";

interface StatusChange {
  time: number;
  status: "offDuty" | "sleeperBerth" | "driving" | "onDuty";
  location: string;
  activity: string;
}

interface LogEntry {
  date: string;
  from: string;
  to: string;
  driverName: string;
  coDriverName: string;
  homeTerminal: string;
  mainOfficeAddress: string;
  carrierName: string;
  totalDrivingToday: string;
  totalMileageToday: string;
  truck: string;
  trailer: string;
  timeEntries: {
    offDuty: { start: number | null; end: number | null }[];
    sleeperBerth: { start: number | null; end: number | null }[];
    driving: { start: number | null; end: number | null }[];
    onDuty: { start: number | null; end: number | null }[];
  };
  remarks: StatusChange[];
  shippingDocuments: string;
  receiptCompleted: string;
  pickupAt: string;
  deliveryAt: string;
  startingTime: string;
  endingTime: string;
}

interface DailyLog {
  id?: number;
  date: string;
  from_location: string;
  to_location: string;
  driver_name: string;
  co_driver_name: string;
  home_terminal: string;
  main_office_address: string;
  carrier_name: string;
  total_miles_driving: string;
  total_mileage: string;
  truck_number: string;
  trailer: string;
  time_entries: {
    offDuty: { start: number; end: number }[];
    sleeperBerth: { start: number; end: number }[];
    driving: { start: number; end: number }[];
    onDuty: { start: number; end: number }[];
  };
  remarks: StatusChange[];
  shipping_documents: string;
  recap_total_hours: string;
  pickup_at: string;
  delivery_at: string;
  starting_time: string;
  ending_time: string;
}

interface DriversLogSheetProps {
  log?: DailyLog;
  tripId?: number;
  onDelete?: (logId: number) => void; // Add onDelete prop
}

const DriversLogSheet: React.FC<DriversLogSheetProps> = ({
  log,
  tripId,
  onDelete,
}) => {
  const [tempEndTime, setTempEndTime] = useState<number | null>(null);
  const [activeEntry, setActiveEntry] = useState<{
    status: keyof typeof logEntry.timeEntries;
    index: number;
  } | null>(null);

  const [logEntry, setLogEntry] = useState<LogEntry>(() => {
    if (log) {
      return {
        date: log.date,
        from: log.from_location,
        to: log.to_location,
        driverName: log.driver_name,
        coDriverName: log.co_driver_name,
        homeTerminal: log.home_terminal,
        mainOfficeAddress: log.main_office_address,
        carrierName: log.carrier_name,
        totalDrivingToday: log.total_miles_driving,
        totalMileageToday: log.total_mileage,
        truck: log.truck_number,
        trailer: log.trailer,
        timeEntries: {
          offDuty: log.time_entries.offDuty.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          sleeperBerth: log.time_entries.sleeperBerth.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          driving: log.time_entries.driving.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          onDuty: log.time_entries.onDuty.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
        },
        remarks: log.remarks,
        shippingDocuments: log.shipping_documents,
        receiptCompleted: log.recap_total_hours,
        pickupAt: log.pickup_at,
        deliveryAt: log.delivery_at,
        startingTime: log.starting_time,
        endingTime: log.ending_time,
      };
    }
    return {
      date: new Date().toISOString().split("T")[0],
      from: "",
      to: "",
      driverName: "",
      coDriverName: "",
      homeTerminal: "",
      mainOfficeAddress: "",
      carrierName: "",
      totalDrivingToday: "0",
      totalMileageToday: "0",
      truck: "",
      trailer: "",
      timeEntries: {
        offDuty: [],
        sleeperBerth: [],
        driving: [],
        onDuty: [],
      },
      remarks: [],
      shippingDocuments: "",
      receiptCompleted: "0",
      pickupAt: "",
      deliveryAt: "",
      startingTime: "",
      endingTime: "",
    };
  });

  // Sync logEntry with log prop
  useEffect(() => {
    if (log) {
      setLogEntry({
        date: log.date,
        from: log.from_location,
        to: log.to_location,
        driverName: log.driver_name,
        coDriverName: log.co_driver_name,
        homeTerminal: log.home_terminal,
        mainOfficeAddress: log.main_office_address,
        carrierName: log.carrier_name,
        totalDrivingToday: log.total_miles_driving,
        totalMileageToday: log.total_mileage,
        truck: log.truck_number,
        trailer: log.trailer,
        timeEntries: {
          offDuty: log.time_entries.offDuty.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          sleeperBerth: log.time_entries.sleeperBerth.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          driving: log.time_entries.driving.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
          onDuty: log.time_entries.onDuty.map((entry) => ({
            start: entry.start,
            end: entry.end,
          })),
        },
        remarks: log.remarks,
        shippingDocuments: log.shipping_documents,
        receiptCompleted: log.recap_total_hours,
        pickupAt: log.pickup_at,
        deliveryAt: log.delivery_at,
        startingTime: log.starting_time,
        endingTime: log.ending_time,
      });
    }
  }, [log]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<
    "offDuty" | "sleeperBerth" | "driving" | "onDuty" | null
  >(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [newRemark, setNewRemark] = useState<StatusChange>({
    time: 0,
    status: "offDuty",
    location: "",
    activity: "",
  });

  const checkForOverlap = (
    newStart: number,
    newEnd: number,
    excludeStatus?: keyof typeof logEntry.timeEntries,
    excludeIndex?: number
  ): boolean => {
    const allEntries = [
      ...logEntry.timeEntries.offDuty.map((entry, idx) => ({
        start: entry.start!,
        end: entry.end!,
        status: "offDuty" as const,
        index: idx,
      })),
      ...logEntry.timeEntries.sleeperBerth.map((entry, idx) => ({
        start: entry.start!,
        end: entry.end!,
        status: "sleeperBerth" as const,
        index: idx,
      })),
      ...logEntry.timeEntries.driving.map((entry, idx) => ({
        start: entry.start!,
        end: entry.end!,
        status: "driving" as const,
        index: idx,
      })),
      ...logEntry.timeEntries.onDuty.map((entry, idx) => ({
        start: entry.start!,
        end: entry.end!,
        status: "onDuty" as const,
        index: idx,
      })),
    ];

    return allEntries.some((entry) => {
      if (
        excludeStatus &&
        excludeIndex !== undefined &&
        entry.status === excludeStatus &&
        entry.index === excludeIndex
      ) {
        return false;
      }
      return (
        (newStart < entry.end && newEnd > entry.start) ||
        (newStart === entry.start && newEnd === entry.end)
      );
    });
  };

  const renderTimeGrid = () => {
    const statusRows = [
      { label: "1. Off Duty", key: "offDuty" },
      { label: "2. Sleeper Berth", key: "sleeperBerth" },
      { label: "3. Driving", key: "driving" },
      { label: "4. On Duty", key: "onDuty" },
    ] as const;

    const rowTotals = statusRows.map((row) =>
      logEntry.timeEntries[row.key].reduce(
        (acc, entry) => acc + ((entry.end || 0) - (entry.start || 0)),
        0
      )
    );
    const grandTotal = rowTotals.reduce((sum, total) => sum + total, 0);

    const handleEntryUpdate = (
      status: keyof typeof logEntry.timeEntries,
      newEntries: Array<{ start: number | null; end: number | null }>
    ) => {
      const mergedEntries = newEntries
        .filter((entry) => entry.start !== null && entry.end !== null)
        .sort((a, b) => a.start! - b.start!)
        .reduce((acc, entry) => {
          const last = acc[acc.length - 1];
          if (last && entry.start! <= last.end!) {
            last.end = Math.max(last.end!, entry.end!);
            return acc;
          }
          return [...acc, entry];
        }, [] as Array<{ start: number; end: number }>);

      setLogEntry((prev) => ({
        ...prev,
        timeEntries: {
          ...prev.timeEntries,
          [status]: mergedEntries,
        },
      }));
    };

    const handleMouseDown = (
      rowKey: keyof typeof logEntry.timeEntries,
      e: React.MouseEvent
    ) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedTime = Math.floor((x / rect.width) * 24 * 4) / 4;

      const existingEntryIndex = logEntry.timeEntries[rowKey].findIndex(
        (entry) =>
          entry.start !== null &&
          entry.end !== null &&
          clickedTime >= entry.start &&
          clickedTime < entry.end
      );

      if (existingEntryIndex > -1) {
        setActiveEntry({ status: rowKey, index: existingEntryIndex });
        setIsDrawing(true);
        setStartTime(clickedTime);
      } else {
        setIsDrawing(true);
        setCurrentStatus(rowKey);
        setStartTime(clickedTime);
        setTempEndTime(clickedTime + 0.25);
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDrawing || (!activeEntry && !currentStatus)) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const currentTime = Math.floor((x / rect.width) * 24 * 4) / 4;

      if (activeEntry) {
        const entries = [...logEntry.timeEntries[activeEntry.status]];
        const entry = entries[activeEntry.index];
        const midPoint = (entry.start! + entry.end!) / 2;
        const isAdjustingStart =
          Math.abs(currentTime - entry.start!) <
          Math.abs(currentTime - entry.end!);

        const newStart = isAdjustingStart
          ? Math.min(currentTime, entry.end! - 0.25)
          : entry.start!;
        const newEnd = isAdjustingStart
          ? entry.end!
          : Math.max(currentTime, entry.start! + 0.25);

        if (
          !checkForOverlap(
            newStart,
            newEnd,
            activeEntry.status,
            activeEntry.index
          )
        ) {
          entries[activeEntry.index] = { start: newStart, end: newEnd };
          handleEntryUpdate(activeEntry.status, entries);
        }
      } else if (currentStatus) {
        setTempEndTime(currentTime);
      }
    };

    const handleMouseUp = () => {
      if (activeEntry) {
        setActiveEntry(null);
      } else if (currentStatus && startTime !== null && tempEndTime !== null) {
        const start = Math.min(startTime, tempEndTime);
        const end = Math.max(startTime, tempEndTime);

        if (!checkForOverlap(start, end)) {
          handleEntryUpdate(currentStatus, [
            ...logEntry.timeEntries[currentStatus],
            { start, end },
          ]);
        } else {
          toast.error("Time slot overlaps with existing entry");
        }
      }

      setIsDrawing(false);
      setCurrentStatus(null);
      setStartTime(null);
      setTempEndTime(null);
    };

    return (
      <div className="overflow-x-auto">
        <div
          className="border border-gray-300 min-w-[928px]" // 24 hours * 32px + 96px (label) + 64px (total) = 928px
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex ml-24 mb-1">
            {[...Array(25)].map((_, hour) => (
              <div
                key={hour}
                className="min-w-[32px] text-center text-xs sm:text-sm"
              >
                {hour === 0
                  ? "12AM"
                  : hour === 12
                  ? "12PM"
                  : hour === 24
                  ? "Total"
                  : hour > 12
                  ? `${hour - 12}PM`
                  : `${hour}AM`}
              </div>
            ))}
          </div>
          {statusRows.map((row) => (
            <div
              key={row.key}
              className="flex items-center border-t border-gray-300 h-8"
            >
              <div className="min-w-[96px] text-xs sm:text-sm font-bold pl-2 border-r border-gray-300">
                {row.label}
              </div>
              <div
                className="flex flex-grow relative h-full"
                onMouseDown={(e) => handleMouseDown(row.key, e)}
              >
                {[...Array(24)].map((_, hour) => (
                  <div
                    key={hour}
                    className="min-w-[32px] h-full border border-gray-300 relative cursor-pointer"
                  >
                    <div className="absolute inset-0 grid grid-cols-4">
                      {[...Array(4)].map((_, segment) => (
                        <div
                          key={segment}
                          className="border-r border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {logEntry.timeEntries[row.key].map(
                  (entry, idx) =>
                    entry.start !== null &&
                    entry.end !== null && (
                      <div
                        key={idx}
                        className="absolute h-full bg-blue-200 group"
                        style={{
                          left: `${entry.start * 32}px`,
                          width: `${(entry.end - entry.start) * 32}px`,
                        }}
                      >
                        <div
                          className="absolute left-0 w-2 h-full bg-blue-600 cursor-ew-resize opacity-0 group-hover:opacity-100"
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setActiveEntry({ status: row.key, index: idx });
                            setIsDrawing(true);
                          }}
                        />
                      </div>
                    )
                )}
                {isDrawing &&
                  currentStatus === row.key &&
                  startTime !== null &&
                  tempEndTime !== null && (
                    <div
                      className="absolute h-full bg-blue-200 opacity-50"
                      style={{
                        left: `${Math.min(startTime, tempEndTime) * 32}px`,
                        width: `${Math.abs(tempEndTime - startTime) * 32}px`,
                      }}
                    />
                  )}
              </div>
              <div className="min-w-[64px] text-center text-xs sm:text-sm border-l border-gray-300">
                {rowTotals[statusRows.indexOf(row)].toFixed(1)}
              </div>
            </div>
          ))}
          <div className="flex items-center border-t border-gray-300 h-8">
            <div className="min-w-[96px] text-xs sm:text-sm font-bold pl-2 border-r border-gray-300">
              Total
            </div>
            <div className="flex flex-grow relative">
              {[...Array(24)].map((_, hour) => (
                <div
                  key={hour}
                  className="min-w-[32px] border border-gray-300"
                />
              ))}
            </div>
            <div className="min-w-[64px] text-center text-xs sm:text-sm border-l border-gray-300 font-bold">
              {grandTotal.toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecapSection = () => {
    return (
      <div className="border border-gray-300 p-2 mt-4">
        <div className="grid grid-cols-1 text-xs">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-gray-300 p-1">
              <div className="font-bold mb-1">Design Complies</div>
              <div>With Hours of-Service</div>
              <div>Regulations</div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="font-bold mb-1">70 Hour/8 Day Drivers</div>
              <div className="grid grid-cols-3 gap-1">
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value={logEntry.remarks
                      .reduce((total, remark) => {
                        if (
                          remark.status === "driving" ||
                          remark.status === "onDuty"
                        ) {
                          const entry = logEntry.timeEntries[
                            remark.status
                          ].find((e) => e.start === remark.time);
                          return (
                            total + (entry ? entry.end! - entry.start! : 0)
                          );
                        }
                        return total;
                      }, 0)
                      .toFixed(2)}
                    readOnly
                  />
                  <div className="font-bold">A.</div>
                  <div>Total Hours on duty last 7/8 days</div>
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value={(
                      70 -
                      logEntry.remarks.reduce((total, remark) => {
                        if (
                          remark.status === "driving" ||
                          remark.status === "onDuty"
                        ) {
                          const entry = logEntry.timeEntries[
                            remark.status
                          ].find((e) => e.start === remark.time);
                          return (
                            total + (entry ? entry.end! - entry.start! : 0)
                          );
                        }
                        return total;
                      }, 0)
                    ).toFixed(2)}
                    readOnly
                  />
                  <div className="font-bold">B.</div>
                  <div>Total remaining hours available</div>
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value="0.0"
                    readOnly
                  />
                  <div className="font-bold">C.</div>
                  <div>Total Hours on duty last 5 days</div>
                </div>
              </div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="font-bold mb-1">60 Hour/7 Day Drivers</div>
              <div className="grid grid-cols-3 gap-1">
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value="0.0"
                    readOnly
                  />
                  <div className="font-bold">A.</div>
                  <div>Total Hours on duty last 7/7 days</div>
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value="0.0"
                    readOnly
                  />
                  <div className="font-bold">B.</div>
                  <div>Total remaining hours available</div>
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-1 text-center mb-1"
                    value="0.0"
                    readOnly
                  />
                  <div className="font-bold">C.</div>
                  <div>Total Hours on duty last 5 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs mt-2 text-center italic">
          *If you took 34 consecutive hours off duty you have 70/8 Drivers
          Available*
        </div>
      </div>
    );
  };

  const renderAdditionalDetails = () => {
    return (
      <div className="mt-4 border border-gray-300 p-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs">Shipper or Commodity:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.shippingDocuments}
              onChange={(e) =>
                setLogEntry((prev) => ({
                  ...prev,
                  shippingDocuments: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-xs">Picked Up At:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.pickupAt}
              onChange={(e) =>
                setLogEntry((prev) => ({ ...prev, pickupAt: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs">Delivered At:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.deliveryAt}
              onChange={(e) =>
                setLogEntry((prev) => ({ ...prev, deliveryAt: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <label className="block text-xs">Starting Time:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.startingTime}
              onChange={(e) =>
                setLogEntry((prev) => ({
                  ...prev,
                  startingTime: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-xs">Ending Time:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.endingTime}
              onChange={(e) =>
                setLogEntry((prev) => ({ ...prev, endingTime: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-xs">Total Hours:</label>
            <input
              type="text"
              className="border border-gray-300 p-1 w-full text-xs"
              value={logEntry.receiptCompleted}
              onChange={(e) =>
                setLogEntry((prev) => ({
                  ...prev,
                  receiptCompleted: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>
    );
  };

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    setLogEntry((prev) => ({
      ...prev,
      remarks: [...prev.remarks, newRemark],
    }));
    setNewRemark({ time: 0, status: "offDuty", location: "", activity: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) {
      toast.error("Trip ID is missing.");
      return;
    }
    try {
      const newLog = await createTripLog(tripId, {
        trip: tripId,
        date: logEntry.date,
        from_location: logEntry.from,
        to_location: logEntry.to,
        driver_name: logEntry.driverName,
        co_driver_name: logEntry.coDriverName,
        home_terminal: logEntry.homeTerminal,
        main_office_address: logEntry.mainOfficeAddress,
        carrier_name: logEntry.carrierName,
        total_miles_driving: logEntry.totalDrivingToday,
        total_mileage: logEntry.totalMileageToday,
        truck_number: logEntry.truck,
        trailer: logEntry.trailer,
        time_entries: logEntry.timeEntries,
        remarks: logEntry.remarks,
        shipping_documents: logEntry.shippingDocuments,
        recap_total_hours: logEntry.receiptCompleted,
        pickup_at: logEntry.pickupAt,
        delivery_at: logEntry.deliveryAt,
        starting_time: logEntry.startingTime,
        ending_time: logEntry.endingTime,
      });
      toast.success("Log saved successfully!");
      console.log("Created log:", newLog);
    } catch (error) {
      console.error("Error saving log:", error);
      toast.error("Failed to save log.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white border border-gray-300 max-w-4xl mx-auto font-serif text-sm"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="text-center font-bold text-lg">DRIVER'S DAILY LOG</div>
        {log?.id && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(log.id!)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Log
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs">Name of Driver:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.driverName}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, driverName: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Date:</label>
          <input
            type="date"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.date}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, date: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Home Terminal:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.homeTerminal}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, homeTerminal: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Main Office Address:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.mainOfficeAddress}
            onChange={(e) =>
              setLogEntry((prev) => ({
                ...prev,
                mainOfficeAddress: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Carrier Name:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.carrierName}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, carrierName: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs">
            Truck/Trailer and Trailer Number:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Truck"
              className="border border-gray-300 p-1 text-xs"
              value={logEntry.truck}
              onChange={(e) =>
                setLogEntry((prev) => ({ ...prev, truck: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Trailer"
              className="border border-gray-300 p-1 text-xs"
              value={logEntry.trailer}
              onChange={(e) =>
                setLogEntry((prev) => ({ ...prev, trailer: e.target.value }))
              }
            />
          </div>
        </div>
        <div>
          <label className="block text-xs">From:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.from}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, from: e.target.value }))
            }
          />
          <label className="block text-xs mt-2">To:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.to}
            onChange={(e) =>
              setLogEntry((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs">Total Driving Today:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.totalDrivingToday}
            onChange={(e) =>
              setLogEntry((prev) => ({
                ...prev,
                totalDrivingToday: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="block text-xs">Total Mileage Today:</label>
          <input
            type="text"
            className="border border-gray-300 p-1 w-full text-xs"
            value={logEntry.totalMileageToday}
            onChange={(e) =>
              setLogEntry((prev) => ({
                ...prev,
                totalMileageToday: e.target.value,
              }))
            }
          />
        </div>
      </div>

      {renderTimeGrid()}

      <div className="mt-4">
        <label className="block text-xs font-bold mb-2">Remarks:</label>
        <div className="w-full border border-gray-300 p-2 text-xs mb-2">
          {logEntry.remarks.map((remark, index) => (
            <div key={index}>
              {`At ${remark.time.toFixed(2)}: Changed to ${remark.status} in ${
                remark.location
              }, Activity: ${remark.activity}`}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            step="0.1"
            className="border border-gray-300 p-1 text-xs"
            placeholder="Time (e.g., 6.5)"
            value={newRemark.time}
            onChange={(e) =>
              setNewRemark((prev) => ({
                ...prev,
                time: parseFloat(e.target.value) || 0,
              }))
            }
          />
          <select
            className="border border-gray-300 p-1 text-xs"
            value={newRemark.status}
            onChange={(e) =>
              setNewRemark((prev) => ({
                ...prev,
                status: e.target.value as StatusChange["status"],
              }))
            }
          >
            <option value="offDuty">Off Duty</option>
            <option value="sleeperBerth">Sleeper Berth</option>
            <option value="driving">Driving</option>
            <option value="onDuty">On Duty</option>
          </select>
          <input
            type="text"
            className="border border-gray-300 p-1 text-xs"
            placeholder="Location"
            value={newRemark.location}
            onChange={(e) =>
              setNewRemark((prev) => ({ ...prev, location: e.target.value }))
            }
          />
          <input
            type="text"
            className="border border-gray-300 p-1 text-xs"
            placeholder="Activity"
            value={newRemark.activity}
            onChange={(e) =>
              setNewRemark((prev) => ({ ...prev, activity: e.target.value }))
            }
          />
          <button
            type="button"
            onClick={handleAddRemark}
            className="bg-blue-500 text-white px-2 py-1 text-xs"
          >
            Add Remark
          </button>
        </div>
      </div>

      {renderAdditionalDetails()}

      {renderRecapSection()}

      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Log
        </button>
      </div>
    </form>
  );
};

export default DriversLogSheet;
