import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import CenteredCell from "./CenteredCell";

const previewPalette = [
  "#CE1111",
  "#008CFF",
  "#0AB86F",
  "#D37A07",
  "#76A30C",
  "#B40A2F",
  "#236313",
  "#0044FF",
  "#DA0CDA",
];

const fallbackItems = previewPalette.slice(0, 5).map((color, index) => ({
  id: index + 1,
  title: `Slide ${index + 1}`,
  image: "",
  accentColor: color,
}));

function normalizeItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return fallbackItems;
  }

  return items.slice(0, 9).map((item, index) => ({
    id: item?._id || item?.id || index,
    title: item?.title || item?.heading || `Slide ${index + 1}`,
    image:
      item?.image?.url ||
      item?.imageUrl ||
      item?.url ||
      item?.image ||
      (typeof item === "string" ? item : ""),
    accentColor:
      item?.accentColor ||
      item?.color ||
      previewPalette[index % previewPalette.length],
  }));
}

export default function ImageCardsTable({ items = []}) {
  const previewItems = normalizeItems(items);

  return (
    <CenteredCell sx={{ justifyContent: "center", width: "100%" }}>
      <PreviewShell
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
        onTouchStart={(event) => event.stopPropagation()}
      >
        <StyledSwiper
          effect="cards"
          grabCursor
          modules={[EffectCards]}
          cardsEffect={{
            rotate: true,
            perSlideOffset: 8,
            perSlideRotate: 3,
            slideShadows: false,
          }}
        >
          {previewItems.map((item, index) => (
            <SwiperSlide key={item.id}>
              <SlideCard
                style={{
                  background: item.image
                    ? `linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.26) 100%), url(${item.image}) center/cover`
                    : item.accentColor,
                }}
              >
                <SlideLabel variant="subtitle2">
                  {item?.image ? `image${index + 1}` : ""}
                </SlideLabel>
              </SlideCard>
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </PreviewShell>
    </CenteredCell>
  );
}

const PreviewShell = styled(Box)({
  width: 170,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
});

const StyledSwiper = styled(Swiper)({
  width: 120,
  height: 160,
  overflow: "visible",
  "& .swiper-slide": {
    borderRadius: 18,
  },
});

const SlideCard = styled(Box)({
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: 18,
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 14px 30px rgba(15, 23, 42, 0.18)",
});

const SlideLabel = styled(Typography)({
  padding: "0 10px",
  textAlign: "center",
  fontWeight: 700,
  color: "#FFFFFF",
  textShadow: "0 2px 10px rgba(0, 0, 0, 0.28)",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});
