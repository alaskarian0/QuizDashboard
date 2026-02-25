import svgPaths from "./svg-3t0j2qkfb4";

function Heading() {
  return (
    <div className="h-[32.004px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[32px] left-[95.42px] not-italic text-[#0f172b] text-[24px] top-[-0.65px]" dir="auto">
        السلام عليكم، أحمد! 👋
      </p>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[65.618px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#62748e] text-[12px] top-[-1.54px] w-[66px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          2450 / 3000
        </p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[75.432px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#314158] text-[14px] top-[0.57px] w-[76px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          سلسلة: 7 أيام
        </p>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[19.992px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.9917 19.9917">
        <g clipPath="url(#clip0_66_421)" id="Icon">
          <path d={svgPaths.p3b0ccf00} id="Vector" stroke="var(--stroke-0, #FF6900)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
        </g>
        <defs>
          <clipPath id="clip0_66_421">
            <rect fill="white" height="19.9917" width="19.9917" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[103.42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.997px] items-center relative size-full">
        <Text1 />
        <Icon />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex h-[19.992px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Container />
    </div>
  );
}

function Container2() {
  return <div className="bg-gradient-to-r from-[#00d492] h-[11.995px] rounded-[37170400px] shrink-0 to-[#096] w-full" data-name="Container" />;
}

function Container3() {
  return (
    <div className="bg-[#e2e8f0] h-[11.995px] relative rounded-[37170400px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[57.327px] relative size-full">
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white h-[71.97px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[7.997px] items-start pt-[15.993px] px-[15.993px] relative size-full">
        <Container1 />
        <Container3 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[11.995px] h-[115.969px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Container4 />
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[19.992px] relative shrink-0 w-[55.059px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#45556c] text-[14px] top-[0.57px] w-[56px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          12 أوسمة
        </p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[29.979px] relative shrink-0 w-[76.228px]" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#0f172b] text-[20px] top-[-0.43px]" dir="auto">
          الأوسمة
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[29.979px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text2 />
      <Heading1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[23.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.99 23.99">
        <g id="Icon" opacity="0.3">
          <path d={svgPaths.p124c3700} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[16.911px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#90a1b9] text-[12px] top-[-1.54px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          برق
        </p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[rgba(241,245,249,0.5)] flex-[1_0_0] h-[67.972px] min-h-px min-w-px relative rounded-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.998px] items-center py-[11.995px] relative size-full">
        <Icon1 />
        <Text3 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[23.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.99 23.99">
        <g id="Icon">
          <path d={svgPaths.p2c6b89c0} id="Vector" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d="M4.99792 20.9913H18.9921" id="Vector_2" stroke="var(--stroke-0, #8B5CF6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[20.961px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#314158] text-[12px] top-[-1.54px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          ملك
        </p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] h-[67.972px] min-h-px min-w-px relative rounded-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.998px] items-center py-[11.995px] relative size-full">
        <Icon2 />
        <Text4 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[23.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.99 23.99">
        <g id="Icon">
          <path d={svgPaths.p1534480} id="Vector" stroke="var(--stroke-0, #10B981)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[17.62px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#314158] text-[12px] top-[-1.54px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          نجم
        </p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] h-[67.972px] min-h-px min-w-px relative rounded-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.998px] items-center py-[11.995px] relative size-full">
        <Icon3 />
        <Text5 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[23.99px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.99 23.99">
        <g id="Icon">
          <path d={svgPaths.p17322c00} id="Vector" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d={svgPaths.p34904080} id="Vector_2" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d="M3.99833 21.9908H19.9917" id="Vector_3" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d={svgPaths.p6c56300} id="Vector_4" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d={svgPaths.p7a84ac0} id="Vector_5" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
          <path d={svgPaths.p1eedc500} id="Vector_6" stroke="var(--stroke-0, #F59E0B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.99917" />
        </g>
      </svg>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[15.993px] relative shrink-0 w-[16.841px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-0 text-[#314158] text-[12px] top-[-1.54px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
          فائز
        </p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f8fafc] flex-[1_0_0] h-[67.972px] min-h-px min-w-px relative rounded-[20px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3.998px] items-center py-[11.995px] relative size-full">
        <Icon4 />
        <Text6 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[67.972px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[11.995px] items-start pl-[0.017px] relative size-full">
        <Container7 />
        <Container8 />
        <Container9 />
        <Container10 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-white h-[141.932px] relative rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[11.995px] items-start pt-[15.993px] px-[15.993px] relative size-full">
        <Container6 />
        <Container11 />
      </div>
    </div>
  );
}

function ImageWithFallback() {
  return <div className="absolute h-[199.986px] left-0 opacity-10 top-0 w-[344.653px]" data-name="ImageWithFallback" />;
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[27.988px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9883 27.9883">
        <g id="Icon">
          <path d={svgPaths.pcbce180} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d={svgPaths.p33d56d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d={svgPaths.p31b02680} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[23.99px] left-[184.74px] rounded-[37170400px] top-[1.54px] w-[91.944px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-[12px] text-[12px] text-white top-[2.46px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        التحدي اليومي
      </p>
    </div>
  );
}

function Heading2() {
  return (
    <div className="absolute h-[27.988px] left-0 top-[33.53px] w-[276.681px]" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[125.89px] not-italic text-[18px] text-white top-[-0.32px]" dir="auto">
        اختبار أركان الإسلام
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="absolute h-[19.992px] left-0 top-[65.51px] w-[276.681px]" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[20px] left-[50.51px] text-[#ecfdf5] text-[14px] top-[0.57px] w-[227px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        أجب على 10 أسئلة واحصل على 50 نقطة
      </p>
    </div>
  );
}

function Container14() {
  return (
    <div className="flex-[1_0_0] h-[85.506px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container13 />
        <Heading2 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[85.506px] relative shrink-0 w-[304.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Icon5 />
        <Container14 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white h-[43.964px] relative rounded-[20px] shrink-0 w-[304.67px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[24px] left-[152.56px] not-italic text-[#096] text-[16px] text-center top-[9.66px] translate-x-[-50%]" dir="auto">
          ابدأ الآن
        </p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.995px] h-[181.448px] items-start left-0 pl-[19.992px] pt-[19.992px] top-0 w-[344.653px]" data-name="Container">
      <Container15 />
      <Button />
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[199.986px] overflow-clip relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(149.875deg, rgb(0, 212, 146) 0%, rgb(0, 153, 102) 100%)" }}>
      <ImageWithFallback />
      <Container16 />
    </div>
  );
}

function ImageWithFallback1() {
  return <div className="absolute h-[199.986px] left-0 opacity-10 top-0 w-[344.653px]" data-name="ImageWithFallback" />;
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[27.988px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9883 27.9883">
        <g id="Icon">
          <path d={svgPaths.p20a0e400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[23.99px] left-[186.04px] rounded-[37170400px] top-[1.54px] w-[90.646px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-[12px] text-[12px] text-white top-[2.46px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        اختبار موسمي
      </p>
    </div>
  );
}

function Heading3() {
  return (
    <div className="absolute h-[27.988px] left-0 top-[33.53px] w-[276.681px]" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[75.57px] not-italic text-[18px] text-white top-[-0.32px]" dir="auto">
        تحدي شهر رمضان المبارك
      </p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[19.992px] left-0 top-[65.51px] w-[276.681px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[20px] left-[94.23px] text-[#faf5ff] text-[14px] top-[0.57px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        اختبار خاص بأحكام الصيام والقيام
      </p>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] h-[85.506px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container18 />
        <Heading3 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[85.506px] relative shrink-0 w-[304.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Icon6 />
        <Container19 />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[43.964px] relative rounded-[20px] shrink-0 w-[304.67px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[24px] left-[152.8px] not-italic text-[#9810fa] text-[16px] text-center top-[9.66px] translate-x-[-50%]" dir="auto">
          ابدأ التحدي
        </p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.995px] h-[181.448px] items-start left-0 pl-[19.992px] pt-[19.992px] top-0 w-[344.653px]" data-name="Container">
      <Container20 />
      <Button1 />
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[199.986px] overflow-clip relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(149.875deg, rgb(137, 0, 255) 0%, rgb(49, 0, 85) 100%)" }}>
      <ImageWithFallback1 />
      <Container21 />
    </div>
  );
}

function ImageWithFallback2() {
  return <div className="absolute h-[199.986px] left-0 opacity-10 top-0 w-[344.653px]" data-name="ImageWithFallback" />;
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[27.988px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9883 27.9883">
        <g id="Icon">
          <path d="M9.32945 2.33236V6.99709" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d="M18.6589 2.33236V6.99709" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d={svgPaths.pe62f8c0} id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d="M3.49854 11.6618H24.4898" id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[23.99px] left-[154px] rounded-[37170400px] top-[1.54px] w-[122.685px]" data-name="Container">
      <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-[12px] text-[12px] text-white top-[2.46px] w-[99px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        شهر شعبان 1447 هـ
      </p>
    </div>
  );
}

function Heading4() {
  return (
    <div className="absolute h-[27.988px] left-0 top-[33.53px] w-[276.681px]" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[131.06px] not-italic text-[18px] text-white top-[-0.32px]" dir="auto">
        المسابقة الشهرية
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[19.992px] left-0 top-[65.51px] w-[276.681px]" data-name="Paragraph">
      <p className="absolute css-4hzbpn font-['Noto_Sans_Arabic:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[20px] left-[82.79px] text-[#fef2f2] text-[14px] top-[0.57px] w-[194px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        100 سؤال • 45 مُجاب • المرتبة #3
      </p>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] h-[85.506px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container23 />
        <Heading4 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[85.506px] relative shrink-0 w-[304.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Icon7 />
        <Container24 />
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[43.964px] relative rounded-[20px] shrink-0 w-[304.67px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[24px] left-[152.34px] not-italic text-[#0b14e5] text-[16px] text-center top-[9.66px] translate-x-[-50%]" dir="auto">
          متابعة المسابقة
        </p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.995px] h-[181.448px] items-start left-0 pl-[19.992px] pt-[19.992px] top-0 w-[344.653px]" data-name="Container">
      <Container25 />
      <Button2 />
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[199.986px] overflow-clip relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(149.875deg, rgb(128, 23, 204) 0%, rgb(0, 19, 231) 100%)" }}>
      <ImageWithFallback2 />
      <Container26 />
    </div>
  );
}

function ImageWithFallback3() {
  return <div className="absolute h-[199.986px] left-0 opacity-10 top-0 w-[344.653px]" data-name="ImageWithFallback" />;
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[27.988px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9883 27.9883">
        <g id="Icon">
          <path d="M13.9942 8.16327V24.4898" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
          <path d={svgPaths.p3c419480} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.33236" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.2)] h-[23.99px] left-[219.25px] rounded-[37170400px] top-[1.54px] w-[57.431px]" data-name="Container">
      <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[16px] left-[12px] text-[12px] text-white top-[2.46px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        المكتبة
      </p>
    </div>
  );
}

function Heading5() {
  return (
    <div className="absolute h-[27.988px] left-0 top-[33.53px] w-[276.681px]" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-[76.76px] not-italic text-[18px] text-white top-[-0.32px]" dir="auto">
        مكتبة المعرفة الإسلامية
      </p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[19.992px] left-0 top-[65.51px] w-[276.681px]" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Noto_Sans_Arabic:Regular',sans-serif] font-normal leading-[20px] left-[34.31px] text-[#eff6ff] text-[14px] top-[0.57px]" dir="auto" style={{ fontVariationSettings: "'wdth' 100" }}>
        استكشف مواضيع متنوعة في العقيدة والفقه
      </p>
    </div>
  );
}

function Container29() {
  return (
    <div className="flex-[1_0_0] h-[85.506px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container28 />
        <Heading5 />
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[85.506px] relative shrink-0 w-[304.67px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Icon8 />
        <Container29 />
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-white h-[43.964px] relative rounded-[20px] shrink-0 w-[304.67px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[24px] left-[152.52px] not-italic text-[#155dfc] text-[16px] text-center top-[9.66px] translate-x-[-50%]" dir="auto">
          استكشف المكتبة
        </p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[11.995px] h-[181.448px] items-start left-0 pl-[19.992px] pt-[19.992px] top-0 w-[344.653px]" data-name="Container">
      <Container30 />
      <Button3 />
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[199.986px] overflow-clip relative rounded-[24px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(149.875deg, rgb(81, 162, 255) 0%, rgb(21, 140, 252) 100%)" }}>
      <ImageWithFallback3 />
      <Container31 />
    </div>
  );
}

function HomeScreen() {
  return (
    <div className="absolute bg-[#f9f6ed] content-stretch flex flex-col gap-[19.992px] h-[1390.849px] items-start left-0 pt-[85.073px] px-[15.993px] top-0 w-[376.64px]" data-name="HomeScreen">
      <Container5 />
      <Container12 />
      <Container17 />
      <Container22 />
      <Container27 />
      <Container32 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="h-[19.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[62.5%_20.83%_12.5%_20.83%]" data-name="Vector">
        <div className="absolute inset-[-16.67%_-7.14%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3278 6.66389">
            <path d={svgPaths.p3f499700} id="Vector" stroke="var(--stroke-0, #777777)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_33.33%_54.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.32986 8.32986">
            <path d={svgPaths.p59fb980} id="Vector" stroke="var(--stroke-0, #777777)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#f9f6ed] relative rounded-[20px] shrink-0 size-[35.985px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.997px] px-[7.997px] relative size-full">
        <Icon9 />
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="h-[27.988px] relative shrink-0 w-[101.516px]" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute css-ew64yg font-['Cairo:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#222] text-[20px] top-[-0.54px]" dir="auto">
          نور المعرفة
        </p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="h-[19.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_12.43%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.54%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.689 18.3257">
            <path d={svgPaths.p36d72300} id="Vector" stroke="var(--stroke-0, #777777)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.66389 6.66389">
            <path d={svgPaths.p3d732c00} id="Vector" stroke="var(--stroke-0, #777777)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#f9f6ed] relative rounded-[20px] shrink-0 size-[35.985px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.997px] px-[7.997px] relative size-full">
        <Icon10 />
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="h-[19.992px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[33.33%]" data-name="Vector">
        <div className="absolute inset-[-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.32986 8.32986">
            <path d={svgPaths.p59fb980} id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[83.33%] left-1/2 right-1/2 top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66597 3.33195">
            <path d="M0.832986 0.832986V2.49896" id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[8.33%] left-1/2 right-1/2 top-[83.33%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.83px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.66597 3.33195">
            <path d="M0.832986 0.832986V2.49896" id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_73.58%_73.58%_20.54%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.84048 2.84048">
            <path d={svgPaths.p315443a0} id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_20.54%_20.54%_73.58%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.84048 2.84048">
            <path d={svgPaths.p315443a0} id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[8.33%] right-[83.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33195 1.66597">
            <path d="M0.832986 0.832986H2.49896" id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[83.33%] right-[8.33%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3.33195 1.66597">
            <path d="M0.832986 0.832986H2.49896" id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[73.58%_73.58%_20.54%_20.54%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.84048 2.84048">
            <path d={svgPaths.p41e2f80} id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.54%_20.54%_73.58%_73.58%]" data-name="Vector">
        <div className="absolute inset-[-70.92%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.84048 2.84048">
            <path d={svgPaths.p41e2f80} id="Vector" stroke="var(--stroke-0, #B6904E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66597" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[#f9f6ed] flex-[1_0_0] h-[35.985px] min-h-px min-w-px relative rounded-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[7.997px] px-[7.997px] relative size-full">
        <Icon11 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[35.985px] relative shrink-0 w-[83.965px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.995px] items-center relative size-full">
        <Button5 />
        <Button6 />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[59.975px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[16.011px] pr-[15.993px] relative size-full">
          <Button4 />
          <Heading6 />
          <Container33 />
        </div>
      </div>
    </div>
  );
}

function HomeScreen1() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.95)] content-stretch flex flex-col h-[61.083px] items-start left-0 pb-[1.108px] top-0 w-[376.64px]" data-name="HomeScreen">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-b-[1.108px] border-solid inset-0 pointer-events-none" />
      <Container34 />
    </div>
  );
}

export default function IslamicQuizAppUiDesign() {
  return (
    <div className="bg-white relative size-full" data-name="Islamic Quiz App UI Design">
      <HomeScreen />
      <HomeScreen1 />
    </div>
  );
}