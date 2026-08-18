export const PORTFOLIO_FILTERS = ["ALL", "FULL HOME REMODELS", "KITCHENS + BATHROOMS", "OUTDOOR LIVING", "SHELL + NEW BUILD", "CONCRETE"];

export const PORTFOLIO_PROJECTS = [
  {
    id: "1270-harbor-court",
    cat: "FULL HOME REMODELS",
    title: "1270 Harbor Court",
    phase: "Multi-scope project",
    image: "/images/opc/kitchen-wide.jpg",
    alt: "Finished light wood kitchen at the 1270 Harbor Court remodel",
    detail: "Full-home remodel · addition · kitchen · bath · outdoor living",
    featured: true,
    intro: "One home, documented across the interior remodel, new addition and finished outdoor spaces.",
    rows: [
      {
        label: "Addition — Groundwork to Finish",
        images: [
          ["/images/opc/projects/1270-harbor-court/groundwork.jpg", "Groundwork for the Harbor Court addition"],
          ["/images/opc/projects/1270-harbor-court/addition-before.jpg", "Harbor Court addition under construction"],
          ["/images/opc/projects/1270-harbor-court/addition-progress.jpg", "Stucco and enclosure progress"],
          ["/images/opc/projects/1270-harbor-court/addition-near-finish.jpg", "Addition approaching completion"],
          ["/images/opc/projects/1270-harbor-court/addition-finished.jpg", "Finished addition and outdoor kitchen"],
        ],
      },
      {
        label: "Interior Remodel",
        images: [
          ["/images/opc/kitchen-wide.jpg", "Finished light wood kitchen"],
          ["/images/opc/bathroom-wide.jpg", "Finished terrazzo bathroom"],
          ["/images/opc/bathroom-alt.jpg", "Second view of the finished bathroom"],
        ],
      },
      {
        label: "Raised Planter — Before, Progress, After",
        images: [
          ["/images/opc/projects/1270-harbor-court/planter-before.jpg", "Raised planter framing"],
          ["/images/opc/projects/1270-harbor-court/planter-progress.jpg", "Raised planter concrete progress"],
          ["/images/opc/1270-harbor-ct-outdoor-after-enhanced-v1.jpg", "Finished hardwood bench and raised planter"],
        ],
      },
    ],
  },
  {
    id: "kitchen-collection",
    cat: "KITCHENS + BATHROOMS",
    title: "Kitchen Collection",
    phase: "Finished work",
    image: "/images/opc/kitchen-walnut.jpg",
    alt: "Finished walnut slab kitchen with waterfall stone island",
    detail: "Cabinetry · stone · lighting · finish carpentry",
    intro: "A grouped collection of finished kitchen work, kept together until each home has a complete project sequence.",
    rows: [{ label: "Finished Kitchens", images: [
      ["/images/opc/kitchen-walnut.jpg", "Finished walnut slab kitchen"],
      ["/images/opc/projects/kitchen-collection/kitchen-01.jpg", "Finished Oak Park Construction kitchen"],
      ["/images/opc/projects/kitchen-collection/kitchen-02.jpg", "Kitchen cabinetry and stone work"],
      ["/images/opc/projects/kitchen-collection/kitchen-03.jpg", "Finished kitchen detail"],
    ] }],
  },
  {
    id: "bathroom-collection",
    cat: "KITCHENS + BATHROOMS",
    title: "Bathroom Collection",
    phase: "Finished work",
    image: "/images/opc/bathroom-wide.jpg",
    alt: "Finished bathroom with frameless glass and terrazzo surfaces",
    detail: "Tile · glass · fixtures · precise finish work",
    intro: "Finished bathrooms presented as one honest collection while individual before-and-after sets are still being assembled.",
    rows: [{ label: "Finished Bathrooms", images: [
      ["/images/opc/bathroom-wide.jpg", "Finished terrazzo shower suite"],
      ["/images/opc/bathroom-alt.jpg", "Finished bathroom detail"],
      ["/images/opc/projects/bathroom-collection/bathroom-01.jpg", "Completed bathroom remodel"],
      ["/images/opc/projects/bathroom-collection/bathroom-02.jpg", "Completed shower and tile work"],
      ["/images/opc/projects/bathroom-collection/bathroom-03.jpg", "Completed bathroom finishes"],
    ] }],
  },
  {
    id: "clark-pergola",
    cat: "OUTDOOR LIVING",
    title: "Clark Pergola + Outdoor Kitchen",
    phase: "Build + finished",
    image: "/images/opc/outdoor-kitchen-twilight-wide-v2.jpg",
    alt: "Illuminated outdoor kitchen and pergola at twilight",
    detail: "Pergola · outdoor kitchen · integrated lighting",
    featured: true,
    intro: "The outdoor-living build shown from construction through its finished twilight setting.",
    rows: [
      { label: "During the Build", images: [
        ["/images/opc/projects/clark-pergola/build-01.jpg", "Pergola construction progress"],
        ["/images/opc/projects/clark-pergola/build-02.jpg", "Outdoor kitchen construction progress"],
      ] },
      { label: "Finished Outdoor Living", images: [
        ["/images/opc/outdoor-kitchen-twilight-wide-v2.jpg", "Finished pergola and outdoor kitchen at twilight"],
        ["/images/opc/projects/clark-pergola/finished-01.jpg", "Finished pergola detail"],
        ["/images/opc/projects/clark-pergola/finished-02.jpg", "Finished outdoor living space"],
      ] },
    ],
  },
  {
    id: "shell-construction",
    cat: "SHELL + NEW BUILD",
    title: "Shell Construction",
    phase: "Construction documentation",
    image: "/images/opc/sitework-progress.jpg",
    alt: "Residential shell construction in progress",
    detail: "Site preparation · structure · inspections",
    intro: "Field documentation of structural and shell work in progress.",
    rows: [{ label: "Structure in Progress", images: [
      ["/images/opc/sitework-progress.jpg", "Sitework and shell construction"],
      ["/images/opc/projects/shell-construction/shell-01.jpg", "Shell construction progress"],
      ["/images/opc/projects/shell-construction/shell-02.jpg", "Structural work in progress"],
      ["/images/opc/projects/shell-construction/shell-03.jpg", "Residential shell documentation"],
    ] }],
  },
  {
    id: "concrete-work",
    cat: "CONCRETE",
    title: "Concrete Work",
    phase: "Construction documentation",
    image: "/images/opc/concrete-progress.jpg",
    alt: "Fresh residential concrete slab being finished",
    detail: "Formwork · placement · finish control",
    intro: "Concrete work shown as construction documentation, never presented as finished photography.",
    rows: [{ label: "2112 Rio Vista", images: [
      ["/images/opc/concrete-progress.jpg", "Residential concrete placement"],
      ["/images/opc/projects/concrete-work/rio-vista-01.jpg", "Rio Vista concrete work"],
      ["/images/opc/projects/concrete-work/rio-vista-02.jpg", "Rio Vista concrete progress"],
    ] }],
  },
];

export const getPortfolioProject = (id) => PORTFOLIO_PROJECTS.find((project) => project.id === id);
