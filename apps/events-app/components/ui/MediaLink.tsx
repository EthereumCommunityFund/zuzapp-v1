import { RxMinus, RxPlus } from 'react-icons/rx';
import IconButton from './buttons/IconButton';
import { useState } from 'react';

import { Input } from './input';
import InputFieldDark from './inputFieldDark';
import { InputFieldType } from '@/types';

interface IProps {
  linkType: string;
  formData: any;
  setFormData: any;
}

export default function MediaLink(props: IProps) {
  const { linkType, setFormData, formData } = props;
  const [isLink, setIsLink] = useState(false);
  const [otherLinks, setOtherLinks] = useState(false);
  const [socialLinkItem, setSocialLinkItem] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number, isOtherLink: boolean = false) => {
    const newLinks = isOtherLink ? [...formData.otherLinks] : [...formData.socialMediaLinks];

    newLinks[index].link = event.target.value;

    setFormData((prevData: any) => (isOtherLink ? { ...prevData, otherLinks: newLinks } : { ...prevData, socialMediaLinks: newLinks }));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const isOtherLink = event.target.name === 'otherLink';

    setFormData(isOtherLink ? { ...formData, selectedOtherOption: event.target.value } : { ...formData, selectedOption: event.target.value });
  };

  const addInputField = (isOtherLink: boolean = false) => {
    const { socialMediaLinks, selectedOption, otherLinks, selectedOtherOption } = formData;

    const selectedLabel = isOtherLink ? selectedOtherOption : selectedOption;

    // Check if the selected option has already been added
    const isOptionSelected = isOtherLink ? otherLinks.some((link: any) => link.label === selectedLabel) : socialMediaLinks.some((link: any) => link.label === selectedLabel);

    if (!isOptionSelected) {
      const newLink = { label: selectedLabel, link: '' };

      setFormData((prevData: any) =>
        isOtherLink
          ? {
              ...prevData,
              otherLinks: [...otherLinks, newLink],
            }
          : {
              ...prevData,
              socialMediaLinks: [...socialMediaLinks, newLink],
            }
      );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <div className="flex gap-5">
          <div className="font-semibold text-base leading-[19.px] flex ">{linkType}</div>
          <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setIsLink(!isLink)}></IconButton>
        </div>
        {isLink && (
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col">
              <div className="flex gap-5 ">
                <select onChange={handleSelectChange} title="link" value={formData.selectedOption} className="text-black w-48 rounded-md">
                  <option value="facebook" disabled={formData.socialMediaLinks.some((link: any) => link.label === 'facebook')}>
                    Facebook
                  </option>
                  <option value="twitter" disabled={formData.socialMediaLinks.some((link: any) => link.label === 'twitter')}>
                    Twitter
                  </option>
                  <option value="instagram" disabled={formData.socialMediaLinks.some((link: any) => link.label === 'instagram')}>
                    Instagram
                  </option>
                  <option value="linkedIn" disabled={formData.socialMediaLinks.some((link: any) => link.label === 'linkedIn')}>
                    LinkedIn
                  </option>
                </select>
                <button type="button" className="bg-gray-500 rounded-md py-2 px-4" onClick={addInputField(false) as any}>
                  Add Link
                </button>
              </div>

              <div className="flex-col flex">
                {formData.socialMediaLinks.map((linkData: any, index: number) => (
                  <div key={index}>
                    <label>{linkData.label} Link:</label>
                    <InputFieldDark type={InputFieldType.Link} value={linkData.link} onChange={(e) => handleInputChange(e as unknown as any, index, false)} placeholder={`${linkData.label} Link`} />
                  </div>
                ))}
              </div>
            </div>
            <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxMinus} onClick={() => setIsLink(!isLink)}></IconButton>
          </div>
        )}
      </div>

      <div className="">
        <div className="flex gap-5">
          <div className="font-semibold text-base leading-[19.px] flex ">Extra Links</div>
          <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setOtherLinks(!otherLinks)}></IconButton>
        </div>
        {otherLinks && (
          <div className="flex gap-5 justify-between items-center">
            <div className="flex flex-col">
              <div className="flex gap-5 ">
                <select onChange={handleSelectChange} title="otherlink" value={formData.selectedOtherOption} className="text-black w-48 rounded-md">
                  <option value="website" disabled={formData.otherLinks.some((link: any) => link.label === 'website')}>
                    Website
                  </option>
                  <option value="blog" disabled={formData.otherLinks.some((link: any) => link.label === 'blog')}>
                    Blog
                  </option>

                  <option value="portfolio" disabled={formData.otherLinks.some((link: any) => link.label === 'portfolio')}>
                    Portfoio
                  </option>
                </select>
                <button type="button" className="bg-gray-500 rounded-md py-2 px-4" onClick={addInputField(true) as any}>
                  Add Link
                </button>
              </div>

              <div className="flex-col flex">
                {formData.otherLinks.map((linkData: any, index: number) => (
                  <div key={index}>
                    <label>{linkData.label} Link:</label>
                    <InputFieldDark type={InputFieldType.Link} value={linkData.link} onChange={(e) => handleInputChange(e as unknown as any, index, true)} placeholder={`${linkData.label} Link`} />
                  </div>
                ))}
              </div>
            </div>
            <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxMinus} onClick={() => setOtherLinks(!otherLinks)}></IconButton>
          </div>
        )}
      </div>
    </div>
  );
}
