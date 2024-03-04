import { FC } from "react";
import { useSelector } from "../../../../store/Store";
import Link from "next/link";
import { styled } from "@mui/material";
import { AppState } from "../../../../store/Store";
import Image from "next/image";

const Logo = ({ width, height }: { width?: number; height?: number }) => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? "40px" : "180px",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/" sx={{ width: "100%" }}>
        {customizer.activeMode === "dark" ? (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              style={{
                width: "45px",
                display: "block",
                flexDirection: "row",
              }}
            >
              <Image
                src="/images/logos/musicology-logo.webp"
                alt="logo"
                height={height ?? 40}
                width={width ?? 45}
                priority
              />{" "}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "10px",
              }}
            >
              {customizer.isCollapse ? "" : "MUSICOLOGY.PRO"}
            </div>
          </div>
        ) : (
          <Image
            src={"/images/logos/dark-logo.svg"}
            alt="logo"
            height={height ?? customizer.TopbarHeight}
            width={width ?? 174}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/logos/dark-rtl-logo.svg"
          alt="logo"
          height={height ?? customizer.TopbarHeight}
          width={width ?? 174}
          priority
        />
      ) : (
        <Image
          src="/images/logos/light-logo-rtl.svg"
          alt="logo"
          height={height ?? customizer.TopbarHeight}
          width={width ?? 174}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default Logo;
