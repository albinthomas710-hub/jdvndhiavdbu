import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Target, Plus, Trash2, ChevronRight,
  Sparkles, ArrowLeft, GripVertical
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertPrincipleSchema } from "@shared/schema";
import type { PrincipleWithTactics } from "@shared/schema";

const COLORS = [
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
];

const CATEGORIES = [
  "Psychology", "Marketing", "Sales", "Business", "Communication", "Leadership", "General"
];

function getColorBg(color: string) {
  const map: Record<string, string> = {
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  };
  return map[color] || "bg-primary/10 text-primary";
}

function PrincipleCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-md" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Card>
  );
}

const tacticFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

function AddTacticInline({ principleId }: { principleId: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof tacticFormSchema>>({
    resolver: zodResolver(tacticFormSchema),
    defaultValues: { title: "", description: "" },
  });

  const addTactic = useMutation({
    mutationFn: (values: z.infer<typeof tacticFormSchema>) => apiRequest("POST", "/api/tactics", {
      principleId,
      title: values.title,
      description: values.description || undefined,
      isEffective: true,
      order: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      form.reset();
      setIsAdding(false);
      toast({ title: "Tactic added" });
    },
    onError: () => {
      toast({ title: "Failed to add tactic", variant: "destructive" });
    }
  });

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsAdding(true)}
        className="w-full justify-start text-muted-foreground"
        data-testid={`button-add-tactic-${principleId}`}
      >
        <Plus className="w-3.5 h-3.5 mr-2" />
        Add tactic
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="p-3 rounded-md bg-muted/30"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => addTactic.mutate(values))} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Tactic title..."
                    className="text-sm"
                    data-testid={`input-tactic-title-${principleId}`}
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Describe how this tactic works... (optional)"
                    className="text-sm min-h-[60px]"
                    data-testid={`input-tactic-description-${principleId}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => { setIsAdding(false); form.reset(); }}
              data-testid={`button-cancel-tactic-${principleId}`}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={addTactic.isPending}
              data-testid={`button-save-tactic-${principleId}`}
            >
              {addTactic.isPending ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}

function PrincipleCard({ principle }: { principle: PrincipleWithTactics }) {
  const [expanded, setExpanded] = useState(true);
  const { toast } = useToast();

  const deletePrinciple = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/principles/${principle.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      toast({ title: "Principle deleted" });
    }
  });

  const deleteTactic = useMutation({
    mutationFn: (tacticId: string) => apiRequest("DELETE", `/api/tactics/${tacticId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      toast({ title: "Tactic removed" });
    }
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-0 overflow-visible" data-testid={`card-principle-${principle.id}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-md ${getColorBg(principle.color)} flex items-center justify-center`}>
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-serif text-lg font-bold truncate" data-testid={`text-principle-title-${principle.id}`}>{principle.title}</h3>
                    <Badge variant="secondary" className="text-xs" data-testid={`badge-category-${principle.id}`}>{principle.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-principle-desc-${principle.id}`}>{principle.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setExpanded(!expanded)}
                    data-testid={`button-toggle-principle-${principle.id}`}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deletePrinciple.mutate()}
                    disabled={deletePrinciple.isPending}
                    data-testid={`button-delete-principle-${principle.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t"
            >
              <div className="p-6 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent" data-testid={`text-tactics-count-${principle.id}`}>
                    Tactics ({principle.tactics.length})
                  </span>
                </div>

                {principle.tactics.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {principle.tactics.map((tactic, i) => (
                      <motion.div
                        key={tactic.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-start gap-3 p-3 rounded-md hover-elevate"
                        data-testid={`card-tactic-${tactic.id}`}
                      >
                        <GripVertical className="w-4 h-4 text-muted-foreground/30 mt-0.5 flex-shrink-0" style={{ visibility: "hidden" }} />
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full ${getColorBg(principle.color)} flex items-center justify-center text-xs font-bold mt-0.5`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium" data-testid={`text-tactic-title-${tactic.id}`}>{tactic.title}</p>
                          {tactic.description && (
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed" data-testid={`text-tactic-desc-${tactic.id}`}>{tactic.description}</p>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          style={{ visibility: "hidden" }}
                          className="flex-shrink-0 group-hover:[visibility:visible]"
                          onClick={() => deleteTactic.mutate(tactic.id)}
                          disabled={deleteTactic.isPending}
                          data-testid={`button-delete-tactic-${tactic.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}

                <AddTacticInline principleId={principle.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

const principleFormSchema = insertPrincipleSchema.extend({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
});

function CreatePrincipleDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof principleFormSchema>>({
    resolver: zodResolver(principleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "General",
      color: "orange",
      order: 0,
    },
  });

  const createPrinciple = useMutation({
    mutationFn: (values: z.infer<typeof principleFormSchema>) =>
      apiRequest("POST", "/api/principles", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/principles"] });
      form.reset();
      setOpen(false);
      toast({ title: "Principle created" });
    },
    onError: () => {
      toast({ title: "Failed to create principle", variant: "destructive" });
    }
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) form.reset(); }}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-principle">
          <Plus className="w-4 h-4 mr-2" />
          New Principle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Create a First Principle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => createPrinciple.mutate(values))} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., People buy when perceived value > cost"
                      data-testid="input-principle-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain the core truth behind this principle..."
                      className="min-h-[100px]"
                      data-testid="input-principle-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-principle-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <div className="flex gap-2 mt-2">
                      {COLORS.map(c => (
                        <button
                          type="button"
                          key={c.value}
                          onClick={() => field.onChange(c.value)}
                          className={`w-7 h-7 rounded-full ${c.class} transition-all ${
                            field.value === c.value
                              ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110"
                              : "opacity-50"
                          }`}
                          data-testid={`button-color-${c.value}`}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel-principle">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPrinciple.isPending}
                data-testid="button-save-principle"
              >
                {createPrinciple.isPending ? "Creating..." : "Create Principle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function Workspace() {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: principles, isLoading, error } = useQuery<PrincipleWithTactics[]>({
    queryKey: ["/api/principles"],
  });

  const filtered = principles?.filter(p =>
    filterCategory === "all" || p.category === filterCategory
  );

  const categories = principles
    ? Array.from(new Set(principles.map(p => p.category)))
    : [];

  const totalTactics = principles?.reduce((sum, p) => sum + p.tactics.length, 0) || 0;

  return (
    <div className="min-h-screen">
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button size="icon" variant="ghost" data-testid="button-back-home">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h1 className="font-serif text-xl font-bold" data-testid="text-workspace-title">Workspace</h1>
            </div>
          </div>
          <CreatePrincipleDialog />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Principles</p>
            <p className="text-2xl font-bold font-serif" data-testid="text-total-principles">
              {isLoading ? <Skeleton className="h-8 w-10" /> : principles?.length || 0}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Tactics</p>
            <p className="text-2xl font-bold font-serif" data-testid="text-total-tactics">
              {isLoading ? <Skeleton className="h-8 w-10" /> : totalTactics}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Categories</p>
            <p className="text-2xl font-bold font-serif" data-testid="text-total-categories">
              {isLoading ? <Skeleton className="h-8 w-10" /> : categories.length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Tactics</p>
            <p className="text-2xl font-bold font-serif" data-testid="text-avg-tactics">
              {isLoading ? (
                <Skeleton className="h-8 w-10" />
              ) : (
                principles?.length ? (totalTactics / principles.length).toFixed(1) : "0"
              )}
            </p>
          </Card>
        </div>

        {categories.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2" data-testid="text-filter-label">Filter:</span>
            <Button
              size="sm"
              variant={filterCategory === "all" ? "default" : "outline"}
              onClick={() => setFilterCategory("all")}
              data-testid="button-filter-all"
            >
              All
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filterCategory === cat ? "default" : "outline"}
                onClick={() => setFilterCategory(cat)}
                data-testid={`button-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <PrincipleCardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <Card className="p-12 text-center" data-testid="card-error">
            <p className="text-destructive font-medium mb-2">Failed to load principles</p>
            <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
          </Card>
        )}

        {!isLoading && !error && filtered && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-12 text-center" data-testid="card-empty-state">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-2" data-testid="text-empty-title">
                {filterCategory !== "all" ? "No principles in this category" : "Start with your first principle"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {filterCategory !== "all"
                  ? "Try selecting a different category or create a new principle."
                  : "A first principle is a core truth that cannot be reduced further. What fundamental truth drives your work?"
                }
              </p>
              {filterCategory === "all" && <CreatePrincipleDialog />}
            </Card>
          </motion.div>
        )}

        {filtered && filtered.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {filtered.map(principle => (
                <PrincipleCard key={principle.id} principle={principle} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
