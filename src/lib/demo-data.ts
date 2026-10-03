import { formTemplates } from "@/lib/templates";
import type { Answers, FormDocumentShape, FormSettings, ResponseDocumentShape } from "@/types";

function makeDemoSettings(
  displayMode: "classic" | "conversational",
  thankYouMessage: string,
  submitButtonLabel = "Submit"
): FormSettings {
  return {
    submitButtonLabel,
    thankYouMessage,
    redirectUrl: "",
    displayMode,
    theme: {
      primaryColor: "#8b5cf6",
      backgroundColor: "#111111",
      fontFamily: "inter",
    },
    notifications: {
      sendConfirmationToRespondent: true,
      sendNotificationToOwner: true,
    },
    collectEmailAutomatically: false,
  };
}

export const initialDemoForms: FormDocumentShape[] = [
  {
    _id: "6ac132f42051c2fe65611ba7",
    userId: "demo-user-id",
    title: "Product Experience Survey",
    slug: "sQaJUY4L",
    status: "active",
    responseCount: 142,
    lastResponseAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    fields: [
      {
        id: "f-exp-1",
        type: "rating",
        label: "Overall Satisfaction",
        required: true,
        options: [],
        settings: { maxRating: 5 },
      },
      {
        id: "f-exp-2",
        type: "long_text",
        label: "What did you like most about FCraft?",
        required: false,
        placeholder: "Tell us about your experience...",
        options: [],
        settings: {},
      },
      {
        id: "f-exp-3",
        type: "multiple_choice",
        label: "How likely are you to recommend us to a colleague?",
        required: true,
        options: ["Extremely Likely", "Somewhat Likely", "Neutral", "Unlikely"],
        settings: {},
      },
      {
        id: "f-exp-4",
        type: "dropdown",
        label: "What is your primary use case?",
        required: true,
        options: ["Lead Generation", "Customer Feedback", "Job Applications", "Event Registration"],
        settings: {},
      },
      {
        id: "f-exp-5",
        type: "email",
        label: "Email for follow-up questions",
        required: false,
        placeholder: "you@example.com",
        options: [],
        settings: {},
      },
    ],
    settings: makeDemoSettings(
      "conversational",
      "Thank you! Your feedback helps shape the future of FCraft.",
      "Submit Feedback"
    ),
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: "6ac132f42051c2fe65611c68",
    userId: "demo-user-id",
    title: "Global Tech Summit 2026 Registration",
    slug: "UtE8efQe",
    status: "active",
    responseCount: 98,
    lastResponseAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    fields: [
      {
        id: "f-evt-1",
        type: "short_text",
        label: "Full Name",
        required: true,
        placeholder: "Alex Mercer",
        options: [],
        settings: {},
      },
      {
        id: "f-evt-2",
        type: "email",
        label: "Work Email",
        required: true,
        placeholder: "alex@company.com",
        options: [],
        settings: {},
      },
      {
        id: "f-evt-3",
        type: "number",
        label: "Number of Attendees",
        required: true,
        placeholder: "1",
        options: [],
        settings: { minValue: 1, maxValue: 10 },
      },
      {
        id: "f-evt-4",
        type: "checkboxes",
        label: "Dietary Preferences",
        required: false,
        options: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Standard"],
        settings: {},
      },
      {
        id: "f-evt-5",
        type: "long_text",
        label: "Special Accommodations",
        required: false,
        placeholder: "Any special requirements...",
        options: [],
        settings: {},
      },
    ],
    settings: makeDemoSettings(
      "classic",
      "Registration confirmed! We look forward to seeing you at Summit 2026.",
      "Confirm Registration"
    ),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },

  {
    _id: "6ac132f42051c2fe65611896",
    userId: "demo-user-id",
    title: "Client Intake & Scoping Form",
    slug: "XgXbRbLO",
    status: "active",
    responseCount: 64,
    lastResponseAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    fields: [
      {
        id: "f-cnt-1",
        type: "short_text",
        label: "Your Name",
        required: true,
        options: [],
        settings: {},
      },
      {
        id: "f-cnt-2",
        type: "email",
        label: "Business Email",
        required: true,
        options: [],
        settings: {},
      },
      {
        id: "f-cnt-3",
        type: "dropdown",
        label: "Project Scope",
        required: true,
        options: ["Web App Redesign", "Full-Stack Development", "Brand Identity", "API Integration"],
        settings: {},
      },
      {
        id: "f-cnt-4",
        type: "long_text",
        label: "Project Requirements",
        required: true,
        options: [],
        settings: {},
      },
    ],
    settings: makeDemoSettings(
      "classic",
      "Thank you for reaching out! Our team will review and reply within 24 hours.",
      "Send Intake Details"
    ),
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    _id: "6ac132f42051c2fe65611910",
    userId: "demo-user-id",
    title: "Senior Full-Stack Engineer Application",
    slug: "ksodxOj7",
    status: "active",
    responseCount: 42,
    lastResponseAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    fields: formTemplates[1].fields,
    settings: makeDemoSettings(
      "classic",
      "Application submitted! We will review your portfolio and get back to you.",
      "Submit Application"
    ),
    createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: "6ac132f42051c2fe65611945",
    userId: "demo-user-id",
    title: "Beta Feedback & Feature Requests",
    slug: "wAoLkr9g",
    status: "active",
    responseCount: 88,
    lastResponseAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    fields: formTemplates[2].fields,
    settings: makeDemoSettings(
      "conversational",
      "Thanks for the feedback! We appreciate your insights.",
      "Send Feedback"
    ),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

// In-memory store for serverless demo fallbacks
class DemoStore {
  forms: FormDocumentShape[] = [...initialDemoForms];
  responses: Record<string, ResponseDocumentShape[]> = {};

  constructor() {
    this.initResponses();
  }

  private initResponses() {
    for (const form of this.forms) {
      const list: ResponseDocumentShape[] = [];
      const count = form.responseCount || 35;
      for (let i = 0; i < count; i++) {
        const date = new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000);
        const answers: Answers = {};
        for (const field of form.fields) {
          if (field.type === "rating") answers[field.id] = Math.floor(Math.random() * 5) + 1;
          else if (field.type === "checkboxes") answers[field.id] = field.options.slice(0, 2);
          else if (field.options?.length) answers[field.id] = field.options[i % field.options.length];
          else if (field.type === "email") answers[field.id] = `user${i}@example.com`;
          else if (field.type === "number") answers[field.id] = (i % 5) + 1;
          else answers[field.id] = "Very smooth experience with fluid animations.";
        }
        list.push({
          _id: `resp-${form._id}-${i}`,
          formId: form._id,
          answers,
          metadata: {
            startedAt: date.toISOString(),
            completedAt: date.toISOString(),
            timeToCompleteSeconds: 65 + (i * 12) % 300,
          },
          isComplete: true,
          createdAt: date.toISOString(),
        });
      }
      this.responses[form._id] = list;
    }
  }

  getForms(search?: string, status?: string) {
    return this.forms.filter((f) => {
      const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !status || status === "all" || f.status === status;
      return matchSearch && matchStatus;
    });
  }

  getFormById(id: string) {
    return this.forms.find((f) => f._id === id || f.slug === id);
  }

  getFormBySlug(slug: string) {
    return this.forms.find((f) => f.slug === slug || f._id === slug);
  }

  addForm(title: string, templateId?: string) {
    const template = formTemplates.find((t) => t.id === templateId);
    const newForm: FormDocumentShape = {
      _id: `mock-${Date.now()}`,
      userId: "demo-user-id",
      title,
      slug: Math.random().toString(36).substring(2, 9),
      status: "active",
      responseCount: 0,
      fields: template?.fields ?? formTemplates[0].fields,
      settings: makeDemoSettings("conversational", "Thank you for submitting!"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.forms.unshift(newForm);
    this.responses[newForm._id] = [];
    return newForm;
  }

  updateForm(id: string, updates: Partial<FormDocumentShape>) {
    const index = this.forms.findIndex((f) => f._id === id);
    if (index >= 0) {
      this.forms[index] = { ...this.forms[index], ...updates, updatedAt: new Date().toISOString() };
      return this.forms[index];
    }
    return null;
  }

  deleteForm(id: string) {
    this.forms = this.forms.filter((f) => f._id !== id);
    delete this.responses[id];
  }

  getResponses(formId: string, search?: string) {
    const list = this.responses[formId] ?? [];
    if (!search) return list;
    return list.filter((r) =>
      Object.values(r.answers).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
    );
  }

  addResponse(formId: string, answers: Answers, metadata?: Record<string, unknown>) {
    const form = this.getFormById(formId);
    if (form) {
      form.responseCount = (form.responseCount || 0) + 1;
      form.lastResponseAt = new Date().toISOString();
    }
    const newResp: ResponseDocumentShape = {
      _id: `resp-new-${Date.now()}`,
      formId,
      answers,
      metadata: {
        startedAt: (metadata?.startedAt as string) || new Date().toISOString(),
        completedAt: new Date().toISOString(),
        timeToCompleteSeconds: 85,
        referrer: (metadata?.referrer as string) || "",
      },
      isComplete: true,
      createdAt: new Date().toISOString(),
    };
    if (!this.responses[formId]) this.responses[formId] = [];
    this.responses[formId].unshift(newResp);
    return newResp;
  }

  getAnalytics(formId: string) {
    const form = this.getFormById(formId) || this.forms[0];
    const responses = this.responses[form._id] || [];

    const total = responses.length || 85;
    const avgSeconds = Math.round(
      responses.reduce((acc, r) => acc + (r.metadata?.timeToCompleteSeconds || 90), 0) / (responses.length || 1)
    );

    // Generate timeline
    const dateMap: Record<string, number> = {};
    for (let i = 20; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      dateMap[d] = 0;
    }
    responses.forEach((r) => {
      const d = r.createdAt.slice(0, 10);
      if (dateMap[d] !== undefined) dateMap[d]++;
    });
    const responsesOverTime = Object.entries(dateMap).map(([date, count]) => ({ date, count }));

    // Generate per-field stats
    const fields = form.fields.map((field) => {
      if (field.type === "rating") {
        return {
          field: { id: field.id, label: field.label, type: field.type },
          type: field.type,
          count: total,
          average: 4.8,
          median: 5,
          min: 1,
          max: 5,
        };
      }
      if (field.options?.length) {
        return {
          field: { id: field.id, label: field.label, type: field.type },
          type: field.type,
          count: total,
          distribution: field.options.map((opt, i) => ({
            label: opt,
            count: Math.max(5, Math.round(total * (0.5 / (i + 1)))),
          })),
        };
      }
      return {
        field: { id: field.id, label: field.label, type: field.type },
        type: field.type,
        count: total,
      };
    });

    return {
      overview: {
        totalResponses: total,
        completionRate: 94.2,
        averageTimeToComplete: avgSeconds || 110,
        responsesToday: 4,
      },
      responsesOverTime,
      fields,
    };
  }
}

export const demoStore = new DemoStore();
