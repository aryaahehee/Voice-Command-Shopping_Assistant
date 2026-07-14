"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ITEM_CATEGORIES, ITEM_UNITS } from "@/lib/constants";
import type { CreateShoppingItemInput, ItemUnit, ItemCategory } from "@/types";

interface AddItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (item: CreateShoppingItemInput) => Promise<void>;
  initialValues?: Partial<CreateShoppingItemInput & { _id: string }>;
}

const DEFAULT_FORM: CreateShoppingItemInput = {
  name: "",
  quantity: 1,
  unit: "pcs",
  category: "other",
  notes: "",
  price: undefined,
  brand: "",
  addedVoice: false,
};

export function AddItemForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: AddItemFormProps) {
  const [form, setForm] = useState<CreateShoppingItemInput>({
    ...DEFAULT_FORM,
    ...initialValues,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Item name is required";
    if (form.quantity !== undefined && form.quantity <= 0)
      next.quantity = "Quantity must be greater than 0";
    if (form.price !== undefined && form.price < 0)
      next.price = "Price cannot be negative";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        brand: form.brand?.trim() || undefined,
        notes: form.notes?.trim() || undefined,
        price: form.price || undefined,
      });
      setForm(DEFAULT_FORM);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const set = <K extends keyof CreateShoppingItemInput>(
    key: K,
    value: CreateShoppingItemInput[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const isEdit = !!initialValues?._id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit item" : "Add item to list"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="item-name">Item name *</Label>
            <Input
              id="item-name"
              placeholder="e.g. Whole milk"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              aria-invalid={!!errors.name}
              autoFocus
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-qty">Quantity</Label>
              <Input
                id="item-qty"
                type="number"
                min={0.01}
                step={0.01}
                value={form.quantity}
                onChange={(e) =>
                  set("quantity", parseFloat(e.target.value) || 1)
                }
                aria-invalid={!!errors.quantity}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-unit">Unit</Label>
              <Select
                value={form.unit}
                onValueChange={(v) => set("unit", v as ItemUnit)}
              >
                <SelectTrigger id="item-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEM_UNITS.map((u) => (
                    <SelectItem key={u.value} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="item-category">Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v as ItemCategory)}
            >
              <SelectTrigger id="item-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand + Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-brand">Brand (optional)</Label>
              <Input
                id="item-brand"
                placeholder="e.g. Organic Valley"
                value={form.brand ?? ""}
                onChange={(e) => set("brand", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-price">Price $ (optional)</Label>
              <Input
                id="item-price"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.price ?? ""}
                onChange={(e) =>
                  set(
                    "price",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                aria-invalid={!!errors.price}
              />
              {errors.price && (
                <p className="text-xs text-destructive">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="item-notes">Notes (optional)</Label>
            <Textarea
              id="item-notes"
              placeholder="Any extra details…"
              rows={2}
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              className="resize-none"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {isEdit ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
