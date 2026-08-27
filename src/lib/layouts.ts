export type ComponentName =
  | "Header"
  | "About"
  | "Info"
  | "Clients"
  | "ProjectsListSmall"
  | "ProjectsListMedium"
  | "ProjectsListLarge"
  | "Preview"
  | "News"
  | "CameraRoll"
  | "Live"
  | "Radio"
  | "Recognition"
  | "SpeechBubble"
  | "Spacer"
  | "Group";

export type ColSpan = {
  mobile: number;
  tablet: number;
  desktop: number;
};

// Per-breakpoint flex `order` override. Unset breakpoints fall back to the
// next-widest breakpoint's value, then to source (DOM) order.
export type Order = {
  mobile?: number;
  tablet?: number;
  desktop?: number;
};

export type LayoutSlot = {
  component: ComponentName;
  colSpan: ColSpan;
  order?: Order;
  sticky?: boolean;
  // Number of gallery images to show per project row (ProjectsListSmall/Large).
  showPreview?: number;
  // Only used when component === "Group": how its children flow inside it.
  // "row" matches the page's normal wrapping behavior; "column" stacks them.
  direction?: "row" | "column";
  children?: LayoutSlot[];
};

// Indices (into `layouts` below) excluded from the mobile random pick and
// from the Layout dropdown while on mobile. Desktop/tablet are unaffected.
export const mobileDisabledLayouts: number[] = [2, 3];

export const layouts: LayoutSlot[][] = [
  [
    {
      component: "Header",
      colSpan: { mobile: 4, tablet: 10, desktop: 20 },
      order: { mobile: 1 },
    },

    {
      component: "ProjectsListSmall",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
      showPreview: 3,
      order: { mobile: 2 },
    },
    // { component: "Spacer", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },
    // {
    //   component: "Preview",
    //   colSpan: { mobile: 5, tablet: 4, desktop: 4 },
    //   order: { mobile: 3 },
    // },

    {
      component: "About",
      colSpan: { mobile: 5, tablet: 4, desktop: 10 },
      order: { mobile: 4 },
    },
    { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 10 } },

    {
      component: "CameraRoll",
      colSpan: { mobile: 5, tablet: 9, desktop: 10 },
      order: { mobile: 7 },
    },
    { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 10 } },

    {
      component: "Recognition",
      colSpan: { mobile: 5, tablet: 3, desktop: 10 },
      order: { mobile: 5 },
    },

    { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 10 } },

    {
      component: "Clients",
      colSpan: { mobile: 5, tablet: 10, desktop: 10 },
      order: { mobile: 6 },
    },
    { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 10 } },

    {
      component: "News",
      colSpan: { mobile: 5, tablet: 8, desktop: 8 },
      order: { mobile: 8 },
    },
    // { component: "Radio", colSpan: { mobile: 5, tablet: 10, desktop: 20 } },
    // { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 1 } },

    {
      component: "Live",
      colSpan: { mobile: 1, tablet: 2, desktop: 2 },
      order: { mobile: 1 },
    },
    {
      component: "Info",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
      order: { mobile: 10 },
    },
  ],
  // LAYOUT 2
  [
    {
      component: "ProjectsListSmall",
      colSpan: { mobile: 5, tablet: 10, desktop: 10 },
      // showPreview: true,
      sticky: true,
    },
    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 4 } },

    {
      component: "Group",
      colSpan: { mobile: 5, tablet: 6, desktop: 4 },
      direction: "column", // or "row" (default) — "row" flows/wraps like the rest of the page
      children: [
        {
          component: "Preview",
          colSpan: { mobile: 5, tablet: 4, desktop: 6 },
          // sticky: true,
        },

        {
          component: "Recognition",
          colSpan: { mobile: 5, tablet: 6, desktop: 6 },
          order: { mobile: 4 },
        },

        {
          component: "News",
          colSpan: { mobile: 5, tablet: 6, desktop: 6 },
          order: { mobile: 5 },
        },

        {
          component: "CameraRoll",
          colSpan: { mobile: 5, tablet: 6, desktop: 6 },
          order: { mobile: 6 },
        },

        {
          component: "About",
          colSpan: { mobile: 5, tablet: 6, desktop: 6 },
          order: { mobile: 2 },
        },

        {
          component: "Group",
          colSpan: { mobile: 5, tablet: 6, desktop: 6 },
          direction: "row", // or "row" (default) — "row" flows/wraps like the rest of the page
          children: [
            {
              component: "Clients",
              colSpan: { mobile: 5, tablet: 10, desktop: 4 },
              order: { mobile: 3 },
            },
            {
              component: "Live",
              colSpan: { mobile: 1, tablet: 2, desktop: 2 },
              order: { mobile: 7 },
            },
          ],
        },
      ],
    },
    {
      component: "Info",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
      order: { mobile: 9 },
    },
  ],
  // LAYOUT 3
  [
    { component: "Header", colSpan: { mobile: 5, tablet: 6, desktop: 18 } },

    {
      component: "Live",
      colSpan: { mobile: 5, tablet: 4, desktop: 2 },
      sticky: true,
    },

    {
      component: "ProjectsListMedium",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
    },
    { component: "Radio", colSpan: { mobile: 5, tablet: 6, desktop: 20 } },

    { component: "Spacer", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },

    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "News", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },
    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "Recognition", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },
    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "About", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },
    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "Recognition", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },
    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "CameraRoll", colSpan: { mobile: 5, tablet: 6, desktop: 6 } },

    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 14 } },
    { component: "Clients", colSpan: { mobile: 5, tablet: 10, desktop: 6 } },
    { component: "Info", colSpan: { mobile: 5, tablet: 10, desktop: 20 } },
  ],
  // LAYOUT 4

  [
    { component: "Header", colSpan: { mobile: 5, tablet: 6, desktop: 20 } },

    {
      component: "ProjectsListSmall",
      colSpan: { mobile: 5, tablet: 10, desktop: 10 },
    },
    {
      component: "Preview",
      colSpan: { mobile: 5, tablet: 4, desktop: 10 },
    },

    // { component: "Radio", colSpan: { mobile: 5, tablet: 6, desktop: 10 } },
    { component: "About", colSpan: { mobile: 5, tablet: 6, desktop: 10 } },

    {
      component: "Recognition",
      colSpan: { mobile: 5, tablet: 6, desktop: 10 },
    },
    { component: "CameraRoll", colSpan: { mobile: 5, tablet: 6, desktop: 10 } },

    { component: "News", colSpan: { mobile: 5, tablet: 6, desktop: 10 } },

    { component: "Clients", colSpan: { mobile: 5, tablet: 10, desktop: 18 } },
    { component: "Live", colSpan: { mobile: 5, tablet: 2, desktop: 2 } },

    { component: "Info", colSpan: { mobile: 5, tablet: 10, desktop: 20 } },
  ],
  // LAYOUT 5
  [
    {
      component: "Header",
      colSpan: { mobile: 5, tablet: 6, desktop: 20 },
      order: { mobile: 0 },
    },

    {
      component: "ProjectsListLarge",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
      // showPreview: true,
      order: { mobile: 1 },
    },

    {
      component: "About",
      colSpan: { mobile: 5, tablet: 6, desktop: 10 },
      order: { mobile: 2 },
    },
    {
      component: "CameraRoll",
      colSpan: { mobile: 5, tablet: 6, desktop: 10 },
      order: { mobile: 5 },
    },
    {
      component: "Clients",
      colSpan: { mobile: 5, tablet: 10, desktop: 10 },
      order: { mobile: 3 },
    },

    {
      component: "Recognition",
      colSpan: { mobile: 5, tablet: 6, desktop: 10 },
      order: { mobile: 4 },
    },
    {
      component: "News",
      colSpan: { mobile: 5, tablet: 6, desktop: 10 },
      order: { mobile: 6 },
    },

    // { component: "Radio", colSpan: { mobile: 5, tablet: 6, desktop: 10 } },

    { component: "Spacer", colSpan: { mobile: 14, tablet: 14, desktop: 8 } },
    {
      component: "Live",
      colSpan: { mobile: 1, tablet: 2, desktop: 2 },
      order: { mobile: 7 },
    },
    {
      component: "Info",
      colSpan: { mobile: 5, tablet: 10, desktop: 20 },
      order: { mobile: 8 },
    },
  ],
  // // LAYOUT 6
  // [
  //   {
  //     component: "Group",
  //     colSpan: { mobile: 5, tablet: 4, desktop: 6 },
  //     direction: "column",
  //     sticky: true,
  //     children: [
  //       { component: "Header", colSpan: { mobile: 5, tablet: 4, desktop: 6 } },
  //       { component: "Preview", colSpan: { mobile: 5, tablet: 4, desktop: 6 } },
  //       { component: "About", colSpan: { mobile: 5, tablet: 4, desktop: 6 } },
  //     ],
  //   },

  //   {
  //     component: "ProjectsListMedium",
  //     colSpan: { mobile: 5, tablet: 6, desktop: 14 },
  //   },

  //   { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 20 } },

  //   {
  //     component: "Recognition",
  //     colSpan: { mobile: 5, tablet: 3, desktop: 6 },
  //   },
  //   {
  //     component: "News",
  //     colSpan: { mobile: 5, tablet: 3, desktop: 6 },
  //   },
  //   {
  //     component: "CameraRoll",
  //     colSpan: { mobile: 5, tablet: 4, desktop: 8 },
  //   },

  //   { component: "Spacer", colSpan: { mobile: 18, tablet: 18, desktop: 20 } },

  //   {
  //     component: "Clients",
  //     colSpan: { mobile: 5, tablet: 8, desktop: 10 },
  //   },
  //   {
  //     component: "Live",
  //     colSpan: { mobile: 1, tablet: 2, desktop: 2 },
  //   },

  //   {
  //     component: "Info",
  //     colSpan: { mobile: 5, tablet: 10, desktop: 20 },
  //   },
  // ],
];
