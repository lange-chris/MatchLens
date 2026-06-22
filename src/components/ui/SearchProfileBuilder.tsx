"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function SearchProfileBuilder() {
  const [profileName, setProfileName] = useState("Search profile from 15.06.2026");
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [isPaused, setIsPaused] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("field");
  
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [searchCriterion, setSearchCriterion] = useState("");
  
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (title: string, message: string, type: 'success' | 'error') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleAccordion = (name: string) => {
    const isOpening = openAccordion !== name;
    setOpenAccordion(isOpening ? name : null);
    
    if (isOpening) {
      setTimeout(() => {
        document.getElementById(`accordion-${name}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const supabase = createClient();

  const handleCheck = (label: string) => {
    setCheckedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleSave = async () => {
    const activeFilters = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([label]) => label);
      
    const profile = {
      name: profileName,
      frequency,
      is_paused: isPaused,
      filters: activeFilters,
      search_criterion: searchCriterion
    };
    
    const { error } = await supabase.from('search_profiles').insert([profile]);
    
    if (error) {
      console.error("Error saving profile:", error);
      showToast("Error", "Error saving profile. Please check if the database table exists.", "error");
    } else {
      showToast("Success", "Search Profile saved successfully!", "success");
    }
  };

  const handleDeleteAllFilters = () => {
    setCheckedItems({});
    setSearchCriterion("");
  };

  const AccordionHeader = ({ title, name }: { title: string, name: string }) => (
    <button 
      id={`accordion-${name}`}
      className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors border-b border-border last:border-b-0 scroll-mt-24"
      onClick={() => toggleAccordion(name)}
    >
      <span className="text-base font-bold text-[#1a1235]">{title}</span>
      <span className="material-symbols-outlined text-text-muted">
        {openAccordion === name ? "expand_less" : "expand_more"}
      </span>
    </button>
  );

  const CheckboxItem = ({ label }: { label: string }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <input 
        type="checkbox" 
        checked={!!checkedItems[label]}
        onChange={() => handleCheck(label)}
        className="w-4 h-4 rounded border-border accent-[#2D1B4E]" 
      />
      <span className="text-sm font-bold text-[#1a1235]">{label}</span>
    </label>
  );

  const SelectAllToggle = () => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="w-10 h-5 rounded-full bg-[#E0E0E0] relative"><div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white" /></div>
      <span className="text-sm text-text-muted">Select all</span>
    </label>
  );

  return (
    <div className="bg-[#F8F9FA] rounded-xl p-4 md:p-8 border border-border mt-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1a1235] mb-2">Edit search profile</h2>
        <p className="text-sm text-text-muted max-w-3xl leading-relaxed">
          Find your dream job and configure your search profile(s)! You will automatically receive matching job listings by e-mail on a daily or weekly basis. Please select your preference. You can customize your search profiles at any time.
        </p>
      </div>

      {/* Name and Frequency */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-6">
        <div className="mb-6">
          <label className="block text-sm font-bold text-[#1a1235] mb-2">Search profile name</label>
          <input 
            type="text" 
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1a1235] mb-3">Frequency</label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="frequency" 
                  checked={frequency === 'daily'}
                  onChange={() => setFrequency('daily')}
                  className="w-4 h-4 text-[#2D1B4E] accent-[#2D1B4E]"
                />
                <span className="text-sm text-text-main">daily</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="frequency" 
                  checked={frequency === 'weekly'}
                  onChange={() => setFrequency('weekly')}
                  className="w-4 h-4 text-[#2D1B4E] accent-[#2D1B4E]"
                />
                <span className="text-sm font-bold text-[#1a1235] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#2D1B4E] text-sm">check_circle</span> weekly
                </span>
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <div 
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isPaused ? 'bg-border' : 'bg-[#E0E0E0]'}`}
                onClick={() => setIsPaused(!isPaused)}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isPaused ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-text-muted">paused</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions Container */}
      <div className="bg-white rounded-xl border border-border shadow-sm mb-6 flex flex-col">
        
        {/* Field and Subject */}
        <AccordionHeader title="Field and Subject" name="field" />
        {openAccordion === "field" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-6 animate-fade-in">
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Administration, Management, Economy, Law</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Academic Administration and Management" />
                 <CheckboxItem label="Economics, Management, Business Administration" />
                 <CheckboxItem label="Environmental Science" />
                 <CheckboxItem label="Industrial Engineering" />
                 <CheckboxItem label="Law" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Culture & Arts</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Arts, Design" />
                 <CheckboxItem label="Culture" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Engineering, IT, Mathematics</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Computer Sciences" />
                 <CheckboxItem label="Information Technology" />
                 <CheckboxItem label="Mathematics" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Natural sciences, life sciences, environment</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Biology" />
                 <CheckboxItem label="Chemistry" />
                 <CheckboxItem label="Physics" />
               </div>
             </div>
          </div>
        )}

        {/* Position */}
        <AccordionHeader title="Position" name="position" />
        {openAccordion === "position" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-6 animate-fade-in">
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">With Staff Management Responsibilities</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Chief Physician, Chief of Medicine" />
                 <CheckboxItem label="General Manager, Director, Head of University" />
                 <CheckboxItem label="Professor" />
                 <CheckboxItem label="Team Leader, Group Leader, Laboratory Head" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Young and Senior Professionals</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Assistant" />
                 <CheckboxItem label="Lecturer" />
                 <CheckboxItem label="Medical Assistant" />
                 <CheckboxItem label="PhD Student" />
                 <CheckboxItem label="Postdoc" />
                 <CheckboxItem label="Project Manager, Product Manager, Coordinator" />
                 <CheckboxItem label="Psychologist" />
                 <CheckboxItem label="Research Fellow, Research Assistant" />
                 <CheckboxItem label="Researcher" />
                 <CheckboxItem label="Specialist, Expert" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Career as a civil servant</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Higher service" />
                 <CheckboxItem label="Upper intermediate service" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Studies</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Bachelor's/Master's Thesis, Paper" />
                 <CheckboxItem label="Dual Studies" />
                 <CheckboxItem label="Internship, Placement" />
                 <CheckboxItem label="Student Assistant" />
               </div>
             </div>
          </div>
        )}

        {/* Type of employer */}
        <AccordionHeader title="Type of employer" name="employer" />
        {openAccordion === "employer" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-3 animate-fade-in">
             <SelectAllToggle />
             <CheckboxItem label="Research Institute" />
             <CheckboxItem label="University" />
             <CheckboxItem label="University Hospital" />
             <CheckboxItem label="University of Applied Sciences" />
             <CheckboxItem label="Private university" />
             <CheckboxItem label="Hospital" />
             <CheckboxItem label="Cultural Institution, Cultural Facility" />
             <CheckboxItem label="Public administration: Federal" />
             <CheckboxItem label="School, Educational Institution" />
             <CheckboxItem label="Company" />
          </div>
        )}

        {/* Working hours */}
        <AccordionHeader title="Working hours" name="working_hours" />
        {openAccordion === "working_hours" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-3 animate-fade-in">
             <SelectAllToggle />
             <CheckboxItem label="Full Time" />
             <CheckboxItem label="Part Time" />
          </div>
        )}

        {/* Contract type */}
        <AccordionHeader title="Contract type" name="contract_type" />
        {openAccordion === "contract_type" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-3 animate-fade-in">
             <SelectAllToggle />
             <CheckboxItem label="Permanent" />
             <CheckboxItem label="Temporary" />
          </div>
        )}

        {/* Country */}
        <AccordionHeader title="Country" name="country" />
        {openAccordion === "country" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-6 animate-fade-in">
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">Germany</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Baden-Wurttemberg" />
                 <CheckboxItem label="Bavaria" />
                 <CheckboxItem label="Berlin" />
                 <CheckboxItem label="Hamburg" />
                 <CheckboxItem label="North Rhine-Westphalia" />
               </div>
             </div>
             <div>
               <h3 className="font-bold text-[#1a1235] mb-3">International</h3>
               <div className="flex flex-col gap-3">
                 <SelectAllToggle />
                 <CheckboxItem label="Austria" />
                 <CheckboxItem label="Switzerland" />
                 <CheckboxItem label="Other Countries" />
               </div>
             </div>
          </div>
        )}

        {/* Category */}
        <AccordionHeader title="Category" name="category" />
        {openAccordion === "category" && (
          <div className="p-6 border-b border-border bg-white flex flex-col gap-3 animate-fade-in">
             <SelectAllToggle />
             <CheckboxItem label="Administration, Academic Affairs" />
             <CheckboxItem label="Communication, Marketing, PR, Fundraising" />
             <CheckboxItem label="Consulting" />
             <CheckboxItem label="Controlling, Finance" />
             <CheckboxItem label="Editing" />
             <CheckboxItem label="Education" />
             <CheckboxItem label="Human Resources, Legal, Patenting" />
             <CheckboxItem label="IT, Telecommunication" />
             <CheckboxItem label="Medical Research, Regulatory Affairs" />
             <CheckboxItem label="Research & Development (R&D)" />
             <CheckboxItem label="Sales and Distribution" />
             <CheckboxItem label="Science, Research and Higher Education" />
          </div>
        )}

      </div>

      {/* Footer Search Criterion & Filters */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-6">
         <div className="flex flex-col gap-4">
           <input 
             type="text" 
             value={searchCriterion}
             onChange={(e) => setSearchCriterion(e.target.value)}
             placeholder="search criterion" 
             className="w-full border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-secondary transition-colors"
           />
           <div className="flex justify-end">
             <button onClick={handleDeleteAllFilters} className="text-sm font-bold text-[#1a1235] flex items-center gap-1 hover:text-red-600 transition-colors">
               Delete all filters <span className="material-symbols-outlined text-sm">delete</span>
             </button>
           </div>
         </div>
      </div>

      {/* Action Buttons (Save / Delete / Cancel) */}
      <div className="flex flex-col gap-3">
         <button onClick={handleSave} className="w-full py-3 bg-[#2D1B4E] text-white font-bold rounded-full shadow hover:bg-opacity-90 transition-all text-sm">
           Save
         </button>
         <div className="flex gap-4">
           <button className="flex-1 py-3 bg-white border border-border text-[#2D1B4E] font-bold rounded-full hover:bg-gray-50 transition-all text-sm">
             Delete search profile
           </button>
           <button className="flex-1 py-3 bg-white border border-border text-[#2D1B4E] font-bold rounded-full hover:bg-gray-50 transition-all text-sm">
             Cancel
           </button>
         </div>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl animate-fade-in ${
          toastMessage.type === 'success' ? 'bg-[#2D1B4E] text-white' : 'bg-red-500 text-white'
        }`}>
          <span className="material-symbols-outlined text-xl">
            {toastMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <div>
            <p className="font-bold text-sm leading-tight">{toastMessage.title}</p>
            <p className="text-sm opacity-90">{toastMessage.message}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="ml-4 opacity-70 hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

    </div>
  );
}
