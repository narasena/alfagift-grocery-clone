import * as React from "react";
import { EStockMovementType, IProductStock, IProductStockForm } from "@/types/inventories/product.stock.type";
import { useGetProductStocksPerStore } from "./useGetProductStocksPerStore";
import AdminProductTableCellDataImage from "@/features/admin/components/AdminProductTableCellDataImage";
import AdminProductTableCellDataLink from "@/features/admin/components/AdminProductTableCellDataLink";
import { toast } from "react-toastify";
import apiInstance from "@/utils/api/apiInstance";

export const useAdminProductStocksPerStore = () => {
  const { storeStocks,storeId, storeName, handleGetProductStocksPerStore } = useGetProductStocksPerStore();
  const [toBeUpdatedStocks, setToBeUpdatedStocks] = React.useState<IProductStockForm[]>([]);
  const [checkedRows, setCheckedRows] = React.useState<string[]>([]);
  const [massQuantity, setMassQuantity] = React.useState<number | string>("");
  const [massType, setMassType] = React.useState<EStockMovementType>(EStockMovementType.STORE_IN);
  const [massReference, setMassReference] = React.useState<string>("");
  const [massNotes, setMassNotes] = React.useState<string>("");

  // Ref to hold initial snapshot per productId
  const initialEntriesRef = React.useRef<Record<string, IProductStockForm>>({});
  // Ref to track last focused rowId
  const prevFocusedRef = React.useRef<string | null>(null);

  // On mount or when storeStocks change, populate initialEntriesRef
  React.useEffect(() => {
    const map: Record<string, IProductStockForm> = {};
    for (const row of storeStocks) {
      map[String(row.productId)] = {
        productId: row.productId,
        quantity: row.stock ?? 0,
        type: EStockMovementType.STORE_IN,
        reference: "",
        notes: "",
      };
    }
    initialEntriesRef.current = map;
    // Optionally clear form state if storeStocks changed significantly:
    setToBeUpdatedStocks((prev) => {
      // Remove entries whose productId no longer in storeStocks
      const validIds = new Set(storeStocks.map((r) => String(r.productId)));
      return prev.filter((p) => validIds.has(String(p.productId)));
    });
  }, [storeStocks]);

  React.useEffect(() => {
    console.log(toBeUpdatedStocks);
  }, [toBeUpdatedStocks]);
  const storeStocksListColumnTitles = [
    { key: "image", label: "Image" },
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "stock", label: "Stock" },
    { key: "price", label: "Price" },
    { key: "actions", label: "Actions" },
  ];

  const getStoreStocksCellValue = (storeStock: IProductStock, key: string) => {
    switch (key) {
      case "image":
        return (
          <AdminProductTableCellDataImage
            imageLink={storeStock.product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
            imageAlt={storeStock.product.name}
          />
        );
      case "name":
        return (
          <AdminProductTableCellDataLink
            hrefLink={storeStock && `/inventories/product/${storeStock.product.slug}/${storeStock.storeId}`}
            hrefLabel={storeStock.product.name}
          />
        );
      case "actions":
        return <AdminProductTableCellDataLink hrefLink="#" hrefLabel="Edit" />;
      case "sku":
        return storeStock.product.sku || "—";
      case "price":
        return storeStock.product.price || "—";
      default:
        return (storeStock[key as keyof typeof storeStock] as string | number) || "—";
    }
  };

  const storeStocksUpdateFormsColumnTitles = [
    { key: "image", label: "Image" },
    { key: "name", label: "Product Name" },
    { key: "stock", label: "Current Stock" },
    { key: "date", label: "Last Update" },
    { key: "quantity", label: "Quantity" },
    { key: "movementType", label: "Stock Movement Type" },
    { key: "reference", label: "Reference" },
    { key: "notes", label: "Notes" },
    { key: "actions", label: "Actions" },
  ];
  const stockMovementType = Object.keys(EStockMovementType)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      value: EStockMovementType[key as keyof typeof EStockMovementType],
      label: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    }));

  const makeInitialEntry = (row: IProductStock): IProductStockForm => ({
    productId: row.productId,
    quantity: row.stock ?? 0,
    type: EStockMovementType.STORE_IN, // or default of your choice
    reference: "",
    notes: "",
  });

  const isUnchangedFromInitial = (entry: IProductStockForm, rowId: string) => {
    const initial = initialEntriesRef.current[rowId];
    if (!initial) return false;
    return (
      entry.quantity === initial.quantity &&
      entry.type === initial.type &&
      (entry.reference ?? "") === (initial.reference ?? "") &&
      (entry.notes ?? "") === (initial.notes ?? "")
    );
  };

  const upsertEntry = (
    row: IProductStock,
    overrides: Partial<IProductStockForm>,
    existing: IProductStockForm | undefined
  ): IProductStockForm => {
    if (existing) {
      return {
        ...existing,
        ...overrides,
      };
    } else {
      const init = makeInitialEntry(row);
      return {
        ...init,
        ...overrides,
      };
    }
  };

  const handleCheckboxChange = (newCheckedRows: string[]) => {
    const added = newCheckedRows.filter((id) => !checkedRows.includes(id));
    const removed = checkedRows.filter((id) => !newCheckedRows.includes(id));

    setToBeUpdatedStocks((prev) => prev.filter((p) => !removed.includes(String(p.productId))));

    const addedEntries = added.map((id) => {
      const row = storeStocks.find((r) => String(r.productId) === id)!;
      const existing = toBeUpdatedStocks.find((p) => String(p.productId) === id);
      const overrides: Partial<IProductStockForm> = {};
      if (massQuantity !== "") overrides.quantity = Number(massQuantity);
      if (massType !== "STORE_IN") overrides.type = massType as EStockMovementType;
      if (massReference !== "") overrides.reference = massReference;
      if (massNotes !== "") overrides.notes = massNotes;
      return upsertEntry(row, overrides, existing);
    });

    setToBeUpdatedStocks((prev) => {
      // Avoid duplicates if any existed
      const prevIds = new Set(prev.map((p) => String(p.productId)));
      const toAdd = addedEntries.filter((e) => !prevIds.has(String(e.productId)));
      return [...prev, ...toAdd];
    });

    setCheckedRows(newCheckedRows);
  };

  const handleMassQuantityChange = (value: number) => {
    setMassQuantity(value);
    if (storeStocks.length === 0) return;
    if (checkedRows.length === 0) {
      const allIds = storeStocks.map((r) => String(r.productId));
      setCheckedRows(allIds);
      const allEntries = storeStocks.map((row) => {
        const overrides: Partial<IProductStockForm> = {};
        if (value !== 0) overrides.quantity = value;
        if (massType !== "STORE_IN") overrides.type = massType as EStockMovementType;
        if (massReference !== "") overrides.reference = massReference;
        if (massNotes !== "") overrides.notes = massNotes;
        return upsertEntry(row, overrides, undefined);
      });
      setToBeUpdatedStocks(allEntries);
    } else {
      setToBeUpdatedStocks((prev) => {
        return prev.map((entry) => {
          if (checkedRows.includes(String(entry.productId))) {
            const row = storeStocks.find((r) => String(r.productId) === String(entry.productId))!;
            return upsertEntry(row, { quantity: value }, entry);
          }
          return entry;
        });
      });
    }
  };

  const handleMassTypeChange = (raw: string) => {
    const val = raw as EStockMovementType;
    setMassType(val);
    if (storeStocks.length === 0) return;
    if (checkedRows.length === 0) {
      const allIds = storeStocks.map((r) => String(r.productId));
      setCheckedRows(allIds);
      const allEntries = storeStocks.map((row) => {
        const overrides: Partial<IProductStockForm> = {};
        if (massQuantity !== "") overrides.quantity = Number(massQuantity);
        if (val !== "STORE_IN") overrides.type = val;
        if (massReference !== "") overrides.reference = massReference;
        if (massNotes !== "") overrides.notes = massNotes;
        return upsertEntry(row, overrides, undefined);
      });
      setToBeUpdatedStocks(allEntries);
    } else {
      setToBeUpdatedStocks((prev) => {
        return prev.map((entry) => {
          if (checkedRows.includes(String(entry.productId))) {
            const row = storeStocks.find((r) => String(r.productId) === String(entry.productId))!;
            return upsertEntry(row, { type: val }, entry);
          }
          return entry;
        });
      });
    }
  };

  const handleMassReferenceChange = (value: string) => {
    setMassReference(value);
    if (storeStocks.length === 0) return;
    if (checkedRows.length === 0) {
      const allIds = storeStocks.map((r) => String(r.productId));
      setCheckedRows(allIds);
      const allEntries = storeStocks.map((row) => {
        const overrides: Partial<IProductStockForm> = {};
        if (massQuantity !== "") overrides.quantity = Number(massQuantity);
        if (massType !== "STORE_IN") overrides.type = massType as EStockMovementType;
        if (value !== "") overrides.reference = value;
        if (massNotes !== "") overrides.notes = massNotes;
        return upsertEntry(row, overrides, undefined);
      });
      setToBeUpdatedStocks(allEntries);
    } else {
      setToBeUpdatedStocks((prev) => {
        return prev.map((entry) => {
          if (checkedRows.includes(String(entry.productId))) {
            const row = storeStocks.find((r) => String(r.productId) === String(entry.productId))!;
            return upsertEntry(row, { reference: value }, entry);
          }
          return entry;
        });
      });
    }
  };

  const handleMassNotesChange = (value: string) => {
    setMassNotes(value);
    if (storeStocks.length === 0) return;
    if (checkedRows.length === 0) {
      const allIds = storeStocks.map((r) => String(r.productId));
      setCheckedRows(allIds);
      const allEntries = storeStocks.map((row) => {
        const overrides: Partial<IProductStockForm> = {};
        if (massQuantity !== "") overrides.quantity = Number(massQuantity);
        if (massType !== "STORE_IN") overrides.type = massType as EStockMovementType;
        if (massReference !== "") overrides.reference = massReference;
        if (value !== "") overrides.notes = value;
        return upsertEntry(row, overrides, undefined);
      });
      setToBeUpdatedStocks(allEntries);
    } else {
      setToBeUpdatedStocks((prev) => {
        return prev.map((entry) => {
          if (checkedRows.includes(String(entry.productId))) {
            const row = storeStocks.find((r) => String(r.productId) === String(entry.productId))!;
            return upsertEntry(row, { notes: value }, entry);
          }
          return entry;
        });
      });
    }
  };

  // Per-row input editing: when user edits a single cell in table,
  // we treat it similarly: if row not selected, add to selectedIds and toBeUpdatedStocks,
  // then update that field. If row selected, just update its entry.
  // After update, if entry equals initial snapshot, remove it.
  const handleSingleFieldChange = (row: IProductStock, field: keyof IProductStockForm, rawValue: string | number) => {
    const rowId = String(row.productId);
    const existing = toBeUpdatedStocks.find((p) => String(p.productId) === rowId);
    // Determine the new value or undefined
    const newOverrides: Partial<IProductStockForm> = {};
    if (field === "quantity") {
      const valNum = rawValue === "" ? 0 : Number(rawValue);
      if (valNum <= 0) {
        // remove entry entirely
        setToBeUpdatedStocks((prev) => prev.filter((p) => String(p.productId) !== rowId));
        setCheckedRows((prev) => prev.filter((id) => id !== rowId));
        return;
      }
      newOverrides.quantity = valNum;
    } else if (field === "type") {
      const val = rawValue as EStockMovementType | "";
      if (val === "") {
        // if type cleared: we still keep quantity? We choose to set type undefined
        newOverrides.type = undefined;
      } else {
        newOverrides.type = val as EStockMovementType;
      }
    } else if (field === "reference") {
      const val = rawValue as string;
      if (val === "") {
        newOverrides.reference = undefined;
      } else {
        newOverrides.reference = val;
      }
    } else if (field === "notes") {
      const val = rawValue as string;
      if (val === "") {
        newOverrides.notes = undefined;
      } else {
        newOverrides.notes = val;
      }
    }
    // Upsert
    const updatedEntry = upsertEntry(row, newOverrides, existing);
    // If updatedEntry equals initial snapshot, remove it:
    if (isUnchangedFromInitial(updatedEntry, rowId)) {
      setToBeUpdatedStocks((prev) => prev.filter((p) => String(p.productId) !== rowId));
      setCheckedRows((prev) => prev.filter((id) => id !== rowId));
    } else {
      // Otherwise, ensure in toBeUpdatedStocks and selectedIds
      setToBeUpdatedStocks((prev) => {
        const found = prev.find((p) => String(p.productId) === rowId);
        if (found) {
          return prev.map((p) => (String(p.productId) === rowId ? updatedEntry : p));
        } else {
          return [...prev, updatedEntry];
        }
      });
      setCheckedRows((prev) => (prev.includes(rowId) ? prev : [...prev, rowId]));
    }
  };

  const getStoreStocksUpdateFormsCellValue = (row: IProductStock, key: string) => {
    const rowId = String(row.productId);
    const formEntry = toBeUpdatedStocks.find((p) => p.productId === row.productId)!;
    const initialEntry = initialEntriesRef.current[rowId];
    const maybeRemovePrev = () => {
      const prevId = prevFocusedRef.current;
      if (prevId && prevId !== rowId) {
        const prevEntry = toBeUpdatedStocks.find((p) => p.productId === prevId)!;
        if (prevEntry && isUnchangedFromInitial(prevEntry, prevId)) {
          setToBeUpdatedStocks((prev) => prev.filter((p) => p.productId !== prevId));
        }
      }
    };

    switch (key) {
      case "image":
        return (
          <AdminProductTableCellDataImage
            imageLink={row.product.productImage.find((image) => image.isMainImage === true)?.imageUrl ?? "#"}
            imageAlt={row.product.name}
          />
        );
      case "name":
        return (
          <AdminProductTableCellDataLink
            hrefLink={row && `/inventories/product/${row.product.slug}/${row.storeId}`}
            hrefLabel={row.product.name}
          />
        );
      case "stock":
        return row.stock || "—";
      case "date":
        return row.updatedAt
          ? new Date(row.updatedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "—";
      case "quantity": {
        const displayValue = formEntry ? formEntry.quantity : 0;
        return (
          <div className="border border-black rounded-md">
            <input
              type="number"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="input stock"
              value={displayValue}
              // onFocus={() => {
              //   maybeRemovePrev();
              //   if (!formEntry && initialEntry) setToBeUpdatedStocks((prev) => [...prev, { ...initialEntry }]);
              //   prevFocusedRef.current = rowId;
              // }}
              onChange={(e) => {
                handleSingleFieldChange(row, "quantity", e.target.value);
                // const raw = Number(e.target.value);
                // if (raw === 0) return setToBeUpdatedStocks((prev) => prev.filter((p) => String(p.productId) !== rowId));
                // else {
                //   const value = Number(raw);
                //   setToBeUpdatedStocks((prevStocks) => {
                //     const exists = prevStocks.find((p) => String(p.productId) === rowId);
                //     if (exists) {
                //       return prevStocks.map((p) => (String(p.productId) === rowId ? { ...p, quantity: value } : p));
                //     } else if (initialEntry) {
                //       return [...prevStocks, { ...initialEntry, quantity: value }];
                //     }
                //     return prevStocks;
                //   });
                // }
              }}
              // onBlur={() => {
              //   const entry = toBeUpdatedStocks.find((p) => p.productId === rowId)!;
              //   if (entry && isUnchangedFromInitial(entry, rowId)) {
              //     setToBeUpdatedStocks((prev) => prev.filter((p) => p.productId !== rowId));
              //   }
              // }}
            />
          </div>
        );
      }
      case "movementType": {
        const current = formEntry ? formEntry.type : "";
        return (
          <div className="border border-black rounded-md">
            <select
              name="movementType"
              id=""
              value={current}
              onFocus={() => {
                maybeRemovePrev();
                if (!formEntry && initialEntry) setToBeUpdatedStocks((prev) => [...prev, { ...initialEntry }]);
                prevFocusedRef.current = rowId;
              }}
              onChange={(e) => {
                const value = e.target.value as EStockMovementType;
                setToBeUpdatedStocks((prevStocks) => {
                  return prevStocks.map((product) => {
                    if (product.productId === row.productId) {
                      return { ...product, type: value };
                    }
                    return product;
                  });
                });
              }}
              onBlur={() => {
                const entry = toBeUpdatedStocks.find((p) => p.productId === rowId)!;
                if (entry && isUnchangedFromInitial(entry, rowId)) {
                  setToBeUpdatedStocks((prev) => prev.filter((p) => p.productId !== rowId));
                }
              }}
            >
              <option value="">Select Stock Movement Type</option>
              {stockMovementType.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        );
      }
      case "reference": {
        const currentRef = formEntry ? formEntry.reference ?? "" : "";
        return (
          <div className="border b+order-black rounded-md">
            <input
              type="text"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="reference"
              value={currentRef}
              onFocus={() => {
                maybeRemovePrev();
                if (!formEntry && initialEntry) setToBeUpdatedStocks((prev) => [...prev, { ...initialEntry }]);
                prevFocusedRef.current = rowId;
              }}
              onChange={(e) => {
                const value = String(e.target.value);
                setToBeUpdatedStocks((prevStocks) => {
                  return prevStocks.map((product) => {
                    if (product.productId === row.productId) {
                      return { ...product, reference: value };
                    }
                    return product;
                  });
                });
              }}
              onBlur={() => {
                const entry = toBeUpdatedStocks.find((p) => p.productId === rowId)!;
                if (entry && isUnchangedFromInitial(entry, rowId)) {
                  setToBeUpdatedStocks((prev) => prev.filter((p) => p.productId !== rowId));
                }
              }}
            />
          </div>
        );
      }
      case "notes": {
        const currentNotes = formEntry ? formEntry.notes ?? "" : "";
        return (
          <div className="border border-black rounded-md">
            <input
              type="text"
              className="w-full h-full text-center outline-none focus:placeholder:opacity-0"
              placeholder="notes"
              value={currentNotes}
              onFocus={() => {
                maybeRemovePrev();
                if (!formEntry && initialEntry) setToBeUpdatedStocks((prev) => [...prev, { ...initialEntry }]);
                prevFocusedRef.current = rowId;
              }}
              onChange={(e) => {
                const value = String(e.target.value);
                setToBeUpdatedStocks((prevStocks) => {
                  return prevStocks.map((product) => {
                    if (product.productId === row.productId) {
                      return { ...product, notes: value };
                    }
                    return product;
                  });
                });
              }}
              onBlur={() => {
                const entry = toBeUpdatedStocks.find((p) => p.productId === rowId)!;
                if (entry && isUnchangedFromInitial(entry, rowId)) {
                  setToBeUpdatedStocks((prev) => prev.filter((p) => p.productId !== rowId));
                }
              }}
            />
          </div>
        );
      }
      case "actions":
        return <AdminProductTableCellDataLink hrefLink="#" hrefLabel="Update Stock" />;
      default:
        return (row[key as keyof typeof row] as string | number) || "—";
    }
  };

  const [massEdit, setMassEdit] = React.useState<boolean>(false);

  const handleUpdateStocks = async () => {
    if (toBeUpdatedStocks.length === 0) {
      toast.error("No stocks selected for update");
      return;
    }
    
    try {
      const response = await apiInstance.put(`/inventories/store/update-stocks/${storeId}`, { toBeUpdatedStocks });
      toast.success(response.data.message || "Stocks updated successfully");
      setToBeUpdatedStocks([]);
      setCheckedRows([]);
      setMassEdit(false);
      await handleGetProductStocksPerStore();
    } catch (error: any) {
      console.error("Error updating stock:", error);
      const errorMessage = error.response?.data?.message || "Error updating stock";
      toast.error(errorMessage);
    }
  }

  return {
    storeStocks,
    storeName,
    stockMovementType,
    storeStocksListColumnTitles,
    getStoreStocksCellValue,
    checkedRows,
    toBeUpdatedStocks,
    setToBeUpdatedStocks,
    handleCheckboxChange,
    storeStocksUpdateFormsColumnTitles,
    getStoreStocksUpdateFormsCellValue,
    massEdit,
    setMassEdit,
    massQuantity,
    massType,
    massReference,
    massNotes,
    handleMassQuantityChange,
    handleMassTypeChange,
    handleMassReferenceChange,
    handleMassNotesChange,
    handleUpdateStocks
  };
};
