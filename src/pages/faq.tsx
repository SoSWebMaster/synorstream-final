// @ts-nocheck
import { useState } from "react";
import FooterComponent from "../components/footer/footer";
import Header from "../components/header/Header";
import FaqComponent from "../components/faq/faq";
import bgImage from '/static/images/Website-Background.png'
import DashboadHeader from "../components/dashboad/dashboadHeader";
import { useAppSelector } from "../store";



const faqs=[
    {question:"Who can sign up for SYNC OR STREAM?",answer:"Any independent content creator, freelancer, or individual can sign up with us HERE! We also offer support to businesses of any level. If you’re a part of a business and would like to learn more, contact us for more information."},
    {question:"What are the types of media/projects I can use Sync Or Streams music and SFX in?",answer:"Our licensed music and SFX is able to be used in the following mediums: motion picture of any kind, social media, video and audio advertisements, podcasts, and live video streaming. Anything beyond these listed mediums may not be covered by our licenses, and we suggest you contact us if you’re unsure."},
    {question:"If I do work for a business, can I still sign up?",answer:"Absolutely! If you’re not an active employee of the business, you can still sign up under our Freelancer tier. This tier allows you, as a freelance/1099 worker, to use our music and SFX for client work. If you are an employee (signed contract and W-2 for employment), then you’ll want to refer your business to contact us about how we can support you."},

    {question:"Are there any requirements to use your music? Do I need to submit cue sheets?",answer:"Other than having an active subscription, the only requirement is that you file cue sheets if the music will be used in broadcast on television (network or cable). Cue sheets are also highly recommended for web series’, films, video games, and any other media that you may one day hope to release or broadcast one day."},

    {question:"How do I fill out and file cue sheets?",answer:"A cue sheet is a document that lists all of the musical elements of an audio/visual program. Performing Rights Organizations (PROs) use cue sheets to determine to whom they distribute performance royalties to. This is critical for composers/producers to receive their royalties for public performances. You can find and download cue sheet templates from the major PROs (ASCAP, BMI, or SESAC). If you need further assistance, we recommend you reach out to one of the PROs for more clarification, or you can contact us."},

    {question:"How many YouTube channels and/or projects am I limited to?",answer:"Well, that depends, but essentially there is no limit! The only limitations are: If you are on the Content Creator tier, you can only use music and SFX for projects you’re a part of; you must be a main member and contributor to the project. For example, if it’s a YouTube channel, you must be one of the faces in front of the camera, or have the channel under one of your owned accounts (email, phone, bank account, etc.) Same goes for podcasts, streaming, and anything else. If you’re on the Freelancer tier, well then skies the limit! You can use our music and SFX for any number of projects, whether you’re a part of them or not! Just be sure to give us the video/podcast/stream/movie information by contacting us, or in your Copyright Clearance tab so we’re aware of those projects and can clear them!"},



    {question:"What do I do if one of my videos on YouTube gets blocked from a copyright strike?",answer:"No need to worry at all. If you have a current subscription in good standing, then be sure you’ve given us your channel name, or the applicable video link, and you should be good. In the event that it still gets blocked, contact us and we will be sure to get it cleared AS SOON AS POSSIBLE."},

    {question:"Can I still use music I’ve downloaded during my subscription if I’ve canceled my subscription?",answer:"No. Our agreement permits you to be able to use music and SFX while you are currently subscribed only. If you cancel your subscription, you may no longer use music or SFX you’ve downloaded for new projects. Projects that you made and released during your active subscription are still cleared and ok to have, but they must have been released during your subscription period. If you downloaded a song during your subscription, but then canceled your subscription before the project releases, that project will not be cleared of copyright."},

    {question:"One of my clients' videos received a copyright claim. What should I do?",answer:"Make sure you share your client’s YouTube channel OR the particular video in your COPYRIGHT CLEARANCE tab in your profile."},

    {question:"If I cancel my subscription, will I receive a refund?",answer:"We offer a free trial for users to try out Sync Or Stream to see if it’s right for them. If you cancel during the free trial, you will not be charged. After the free trial, you will be charged, and have access to Sync Or Stream and our licenses for as long as you stay subscribed. If you ever decide to cancel, your subscription will remain valid and in good standing until the end of your subscription period."},

    {question:"Do you have a partner or affiliate program? ",answer:"If interested in partnership opportunities, send us a message. We’d love to chat. Contact us"},

    {question:"Can I use music I download from Sync Or Stream to make songs?",answer:"No. Our music cannot be remixed or re-released outside of the given sync licenses."},

    {question:"My video was muted on a platform other than YouTube, Twitch, or Vimeo. What should I do?",answer:"Unfortunately, some platforms don’t have easily accessible tools to clear copyrights through automation. If you experience this, contact us and we will work to resolve your issue as soon as possible."},

    {question:"What data of mine does Sync Or Stream have access to?",answer:"The only data we will have access to is the list of channels and/or projects you share with us, your email, and your name. All of your billing information is securely stored by our 3-rd party payment processor. Beyond this, we have no access to any other information."},

]
const FaqPage=()=>{
    const [expanded, setExpanded] = useState({});
    const {redirect}=useAppSelector(state=>state.auth);
    const handleChange = (index:any) => {
        console.log(index,"indexindexindex")
        setExpanded(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };
    return (
        <>
            <div className="" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="w-full" style={{ backgroundImage: `url(${bgImage})` }}>
               <div className=" 2xl:px-40 xl:px-36 lg:px-28">
               {redirect ? <DashboadHeader/>:  <Header />}
               </div>
               <div className="p-20">

         <p className="text-[50px] font-semibold text-center py-5 text-[#FB8A2E]">  SYNC OR STREAM FAQs</p>
                 {faqs?.map((item,index)=>(
                      <FaqComponent   handleChange={() => handleChange(index)} expanded={!!expanded[index]}item={item} index={index}/>
                 ))}
               
               </div>
            </div>

            <div>
               <FooterComponent />
            </div>
         </div>
        </>
    )
}

export default FaqPage;