import { db } from "./db";
import { principles, tactics } from "@shared/schema";

export async function seedDatabase() {
  const existing = await db.select().from(principles);
  if (existing.length > 0) return;

  const seedPrinciples = [
    {
      title: "People buy when perceived value exceeds cost",
      description: "To sell more, you need to increase perceived value or reduce the cost they pay (in time, money, & effort). This is the fundamental law of every transaction.",
      category: "Sales",
      color: "orange",
      order: 0,
    },
    {
      title: "Humans are naturally drawn to stories",
      description: "Stories bypass the logical brain and speak directly to emotions. People remember stories 22x more than facts alone. Use narrative structure to persuade.",
      category: "Communication",
      color: "blue",
      order: 1,
    },
    {
      title: "People love to look at things",
      description: "The eyes love to figure stuff out. More of the brain is dedicated to processing vision than any other function. Visual content always outperforms text-only.",
      category: "Marketing",
      color: "green",
      order: 2,
    },
    {
      title: "People naturally focus on faces",
      description: "Humans are hardwired to notice and process faces before anything else. This evolutionary trait can be leveraged in thumbnails, ads, and content.",
      category: "Psychology",
      color: "purple",
      order: 3,
    },
    {
      title: "People feel compelled to return what they receive",
      description: "The reciprocity principle: when someone gives us something, we feel an obligation to give back. Free value creates a psychological debt.",
      category: "Psychology",
      color: "teal",
      order: 4,
    },
  ];

  const createdPrinciples = await db.insert(principles).values(seedPrinciples).returning();

  const seedTactics = [
    { principleId: createdPrinciples[0].id, title: "Create an Instagram 'Story Highlights' reel of testimonials/client wins", description: "Social proof increases perceived value by showing real results others have achieved.", isEffective: true, order: 0 },
    { principleId: createdPrinciples[0].id, title: "List all benefits and their 'estimated value' in your sales pitch", description: "Stack the value so the total far exceeds the price point.", isEffective: true, order: 1 },
    { principleId: createdPrinciples[0].id, title: "Drop the price by $500 for a promotion", description: "Reducing cost is one side of the value equation. Use sparingly.", isEffective: true, order: 2 },

    { principleId: createdPrinciples[1].id, title: "Tell your origin story of struggle to success", description: "Personal transformation stories create emotional connection and relatability.", isEffective: true, order: 0 },
    { principleId: createdPrinciples[1].id, title: "Show 'before and after' as a teaser for thumbnails", description: "Transformation arcs are the most compelling story structure.", isEffective: true, order: 1 },
    { principleId: createdPrinciples[1].id, title: "Use a story as a way to teach a lesson", description: "Parables and case studies make abstract concepts concrete and memorable.", isEffective: true, order: 2 },

    { principleId: createdPrinciples[2].id, title: "Have moving visuals every 5 seconds in VSL videos", description: "Constant visual stimulation keeps attention and prevents drop-off.", isEffective: true, order: 0 },
    { principleId: createdPrinciples[2].id, title: "Use pictures on Miro instead of just text documents", description: "Visual presentations are processed 60,000x faster than text.", isEffective: true, order: 1 },
    { principleId: createdPrinciples[2].id, title: "Send a loom video for outreach instead of just text", description: "Video outreach stands out and leverages the visual processing preference.", isEffective: true, order: 2 },

    { principleId: createdPrinciples[3].id, title: "Use faces in your YouTube thumbnails", description: "YouTube currently requires thumbnails. Faces draw instant attention in a feed.", isEffective: true, order: 0 },
    { principleId: createdPrinciples[3].id, title: "Include team headshots on your landing page", description: "Faces build trust and humanize your brand.", isEffective: true, order: 1 },

    { principleId: createdPrinciples[4].id, title: "Send loom videos positioned as free value in cold emails", description: "Providing free, personalized value triggers reciprocity and starts conversations.", isEffective: true, order: 0 },
    { principleId: createdPrinciples[4].id, title: "Send personalized AND automated voice notes using AI", description: "Personal touches create stronger reciprocity than generic outreach.", isEffective: true, order: 1 },
  ];

  await db.insert(tactics).values(seedTactics);
  console.log("Database seeded with initial principles and tactics");
}
