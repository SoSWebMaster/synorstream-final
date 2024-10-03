import { Button } from "@mui/material";
import { Heading1, Heading2, Heading3, Title } from "./licenseSectionContent";
import Vector2 from "/static/images/Vector2.jpg";

const LicenseSection = () => {
    return (
        <>
            <div
                className=" !bg-cover  !bg-center !w-full !h-[400px]"
                style={{ backgroundImage: `url(${Vector2})` }}
            >
                <div className="!h-full 2xl:px-80 xl:px-60 lg:px-40 py-16">
                    <p className="text-[40px] font-semibold mb-[-20px]">
                        {Heading1}
                    </p>
                    <p className="text-[40px] font-semibold">{Heading2}</p>
                    <p className="2xl:w-[50%] xl:w-[60%] lg:w-[80%]">{Heading3}</p>
                    <Button className="!bg-[#FB8A2E] !text-white w-[180px] !mt-7 !font-bold">
                        {Title}
                    </Button>
                </div>

            </div>

        </>
    );
};

export default LicenseSection;
