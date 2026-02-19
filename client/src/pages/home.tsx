import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb, Target, RefreshCcw, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const examples = [
  {
    principle: "People buy when they believe the value is greater than the cost.",
    tactics: [
      "Create an Instagram 'Story Highlights' reel of testimonials/client Ws.",
      "List off all the benefits of my offer and their 'estimated value' in my sales pitch.",
      "Drop the price by $500 for a promotion."
    ]
  },
  {
    principle: "Humans are naturally drawn to stories.",
    tactics: [
      "Tell my story of how I was broke before copywriting and then how it made me $100k.",
      "Show the 'before and after' as a teaser to the story for a thumbnail.",
      "Use a story as a way to teach a lesson."
    ]
  },
  {
    principle: "People love to look at things. The eyes love to figure stuff out.",
    tactics: [
      "Have moving visuals and pictures every 5 seconds in my VSL video.",
      "Use pictures on miro instead of just a text google doc.",
      "Sending a loom video for outreach instead of just text."
    ]
  }
];

const cycleSteps = [
  { text: "New tactics work like crazy", color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300" },
  { text: "Tactic hunters copy them for mediocre results", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300" },
  { text: "Tactics become overused or environment changes", color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300" },
  { text: "First principle thinkers create new tactics", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" },
];

const blessings = [
  "You're always one step ahead of your competitors. Since they can't create new effective tactics consistently, you always have an edge over them.",
  "With your collection of first principles and deep understanding of the environments you're operating in, you create new AND effective tactics almost effortlessly.",
  "When a big environment changes happen, your competitors freak out. You are able to adapt quickly and easily and take even more of the market share."
];

const curses = [
  "You're always one step behind your competition. Since you can't think for yourself, you're constantly copying what everyone else is doing.",
  "When the environment changes, you're stuck. Your tactics no longer work and you're mad and confused.",
  "You constantly blame whoever you bought/copied the tactics from for your lack of success."
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Master the Framework
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            First Principles{" "}
            <span className="text-primary">Thinking</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Stop copying tactics blindly. Master the core truths that drive results, 
            then create your own winning strategies from the ground up.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link href="/workspace">
              <Button size="lg" data-testid="button-get-started">
                Start Building Principles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#framework">
              <Button size="lg" variant="outline" data-testid="button-learn-more">
                Learn the Framework
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6" id="framework">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              The Core Concepts
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Understanding the difference between principles and tactics is the key to sustainable success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full">
                <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-6">
                  <Lightbulb className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">First Principle</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <span className="font-semibold text-foreground">core fact/truth</span> that cannot be reduced any further.
                </p>
                <div className="inline-block px-4 py-2 rounded-md bg-primary/10 text-primary font-bold text-lg">
                  THE &lsquo;WHY&rsquo; STUFF WORKS
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full">
                <div className="w-14 h-14 rounded-md bg-accent/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">Tactic</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <span className="font-semibold text-foreground">method designed</span> to get a desired result.
                </p>
                <div className="inline-block px-4 py-2 rounded-md bg-accent/10 text-accent font-bold text-lg">
                  THE &lsquo;HOW&rsquo; STUFF WORKS
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              See It In Action
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each first principle unlocks multiple tactics. Here are real-world examples.
            </p>
          </motion.div>

          <div className="space-y-8">
            {examples.map((ex, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <span className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">Principle</span>
                      <p className="font-serif text-lg font-semibold italic leading-relaxed">
                        {ex.principle}
                      </p>
                    </div>
                  </div>
                  <div className="ml-12">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-3 block">Tactics</span>
                    <ol className="space-y-2">
                      {ex.tactics.map((t, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold mt-0.5">
                            {j + 1}
                          </span>
                          <span className="text-muted-foreground leading-relaxed">{t}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <RefreshCcw className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              The Environment-Shift Cycle
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              When the environment changes, everyone is forced to adapt. First principle thinkers thrive while tactic hunters struggle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
            {cycleSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className={`text-sm font-medium px-3 py-1.5 rounded-md ${step.color}`}>
                      {step.text}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full border-destructive/20">
                <h3 className="font-serif text-xl font-bold mb-6 text-destructive flex items-center gap-2">
                  The Curse of Tactic Hunting
                </h3>
                <ul className="space-y-4">
                  {curses.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                      <span className="text-muted-foreground text-sm leading-relaxed">{c}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full border-accent/20">
                <h3 className="font-serif text-xl font-bold mb-6 text-accent flex items-center gap-2">
                  The Blessings of First Principles
                </h3>
                <ul className="space-y-4">
                  {blessings.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                      <span className="text-muted-foreground text-sm leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Effective vs Ineffective
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The anatomy of a tactic reveals whether it&apos;s built on solid ground or quicksand.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-0 overflow-visible">
                <div className="bg-destructive/10 text-destructive text-center py-4 font-bold text-lg rounded-t-md">
                  Ineffective Tactic
                </div>
                <div className="grid grid-cols-2 border-t">
                  <div className="p-4 text-center border-r">
                    <span className="text-sm font-medium text-muted-foreground">False Beliefs/Opinions</span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">Old Tactics</span>
                  </div>
                </div>
                <div className="p-6 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Examples:</p>
                  <ul className="space-y-2">
                    {[
                      "If I use $10k/month in my youtube title I'll get views.",
                      "If I use a shocked face in my thumbnails, I'll get views.",
                      "If I get a college degree, I'll make a ton of money.",
                    ].map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-destructive/50 mt-1.5" />
                        <span className="italic">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card className="p-0 overflow-visible">
                <div className="bg-accent/10 text-accent text-center py-4 font-bold text-lg rounded-t-md">
                  Effective Tactic
                </div>
                <div className="border-t">
                  <div className="p-4 text-center border-b">
                    <span className="text-sm font-medium text-muted-foreground">Current Environment</span>
                  </div>
                  <div className="p-4 text-center">
                    <span className="text-sm font-medium text-muted-foreground">First Principles</span>
                  </div>
                </div>
                <div className="p-6 border-t">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Examples:</p>
                  <ul className="space-y-2">
                    {[
                      "People naturally focus on faces -> YouTube requires thumbnails -> Use faces in thumbnails.",
                      "People feel compelled to return what they receive -> Send looms positioned as free value.",
                      "People assign more value to things personal to them -> Send personalized voice notes using AI.",
                    ].map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent/50 mt-1.5" />
                        <span className="italic">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
              Ready to Think from{" "}
              <span className="text-primary">First Principles?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Build your personal library of principles and derive powerful tactics that actually work.
            </p>
            <Link href="/workspace">
              <Button size="lg" data-testid="button-cta-workspace">
                Open Your Workspace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <span className="font-serif font-bold">First Principles</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Think deeper. Build better.
          </p>
        </div>
      </footer>
    </div>
  );
}
