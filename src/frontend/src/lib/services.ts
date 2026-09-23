import { ServiceCategory } from "@/backend";

export interface ServiceDefinition {
  category: ServiceCategory;
  label: string;
  blurb: string;
  icon: string;
}

/**
 * The eight Honey Do's service categories, in the exact order they appear on
 * the home honeycomb grid. Icons are lucide-react names resolved by the
 * consumer.
 */
export const SERVICES: ServiceDefinition[] = [
  {
    category: ServiceCategory.house,
    label: "House",
    blurb: "Painting, patching, and small repairs.",
    icon: "PaintRoller",
  },
  {
    category: ServiceCategory.yardPlants,
    label: "Yard & Plants",
    blurb: "Planting, weeding, and garden love.",
    icon: "Flower2",
  },
  {
    category: ServiceCategory.fixIt,
    label: "Fix It",
    blurb: "Squeaky doors, wobbly shelves, and small repairs.",
    icon: "Wrench",
  },
  {
    category: ServiceCategory.cleanOrganize,
    label: "Clean & Organize",
    blurb: "Declutter, deep clean, and reset.",
    icon: "Sparkles",
  },
  {
    category: ServiceCategory.moveLift,
    label: "Move & Lift",
    blurb: "Heavy lifting and furniture moves.",
    icon: "Package",
  },
  {
    category: ServiceCategory.errands,
    label: "Errands",
    blurb: "Pickups, drop-offs, and to-do runs.",
    icon: "ShoppingBag",
  },
  {
    category: ServiceCategory.mowing,
    label: "Mowing",
    blurb: "Edging, trimming, and a tidy lawn.",
    icon: "Sprout",
  },
  {
    category: ServiceCategory.showMe,
    label: "Show Me",
    blurb: "Friendly help learning a new task.",
    icon: "Lightbulb",
  },
];

const SERVICE_BY_CATEGORY = new Map(
  SERVICES.map((service) => [service.category, service]),
);

export function getService(category: ServiceCategory): ServiceDefinition {
  return (
    SERVICE_BY_CATEGORY.get(category) ?? {
      category,
      label: "Honey Do",
      blurb: "A little help around the home.",
      icon: "Wrench",
    }
  );
}
