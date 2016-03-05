'use strict';

const LICENSE_CC_BY_4 =
    "Attribution 4.0 International\n" +
    "\n" +
    "=======================================================================\n" +
    "\n" +
    "Creative Commons Corporation (\"Creative Commons\") is not a law firm and\n" +
    "does not provide legal services or legal advice. Distribution of\n" +
    "Creative Commons public licenses does not create a lawyer-client or\n" +
    "other relationship. Creative Commons makes its licenses and related\n" +
    "information available on an \"as-is\" basis. Creative Commons gives no\n" +
    "warranties regarding its licenses, any material licensed under their\n" +
    "terms and conditions, or any related information. Creative Commons\n" +
    "disclaims all liability for damages resulting from their use to the\n" +
    "fullest extent possible.\n" +
    "\n" +
    "Using Creative Commons Public Licenses\n" +
    "\n" +
    "Creative Commons public licenses provide a standard set of terms and\n" +
    "conditions that creators and other rights holders may use to share\n" +
    "original works of authorship and other material subject to copyright\n" +
    "and certain other rights specified in the public license below. The\n" +
    "following considerations are for informational purposes only, are not\n" +
    "exhaustive, and do not form part of our licenses.\n" +
    "\n" +
    "     Considerations for licensors: Our public licenses are\n" +
    "     intended for use by those authorized to give the public\n" +
    "     permission to use material in ways otherwise restricted by\n" +
    "     copyright and certain other rights. Our licenses are\n" +
    "     irrevocable. Licensors should read and understand the terms\n" +
    "     and conditions of the license they choose before applying it.\n" +
    "     Licensors should also secure all rights necessary before\n" +
    "     applying our licenses so that the public can reuse the\n" +
    "     material as expected. Licensors should clearly mark any\n" +
    "     material not subject to the license. This includes other CC-\n" +
    "     licensed material, or material used under an exception or\n" +
    "     limitation to copyright. More considerations for licensors:\n" +
    "	wiki.creativecommons.org/Considerations_for_licensors\n" +
    "\n" +
    "     Considerations for the public: By using one of our public\n" +
    "     licenses, a licensor grants the public permission to use the\n" +
    "     licensed material under specified terms and conditions. If\n" +
    "     the licensor's permission is not necessary for any reason--for\n" +
    "     example, because of any applicable exception or limitation to\n" +
    "     copyright--then that use is not regulated by the license. Our\n" +
    "     licenses grant only permissions under copyright and certain\n" +
    "     other rights that a licensor has authority to grant. Use of\n" +
    "     the licensed material may still be restricted for other\n" +
    "     reasons, including because others have copyright or other\n" +
    "     rights in the material. A licensor may make special requests,\n" +
    "     such as asking that all changes be marked or described.\n" +
    "     Although not required by our licenses, you are encouraged to\n" +
    "     respect those requests where reasonable. More_considerations\n" +
    "     for the public: \n" +
    "	wiki.creativecommons.org/Considerations_for_licensees\n" +
    "\n" +
    "=======================================================================\n" +
    "\n" +
    "Creative Commons Attribution 4.0 International Public License\n" +
    "\n" +
    "By exercising the Licensed Rights (defined below), You accept and agree\n" +
    "to be bound by the terms and conditions of this Creative Commons\n" +
    "Attribution 4.0 International Public License (\"Public License\"). To the\n" +
    "extent this Public License may be interpreted as a contract, You are\n" +
    "granted the Licensed Rights in consideration of Your acceptance of\n" +
    "these terms and conditions, and the Licensor grants You such rights in\n" +
    "consideration of benefits the Licensor receives from making the\n" +
    "Licensed Material available under these terms and conditions.\n" +
    "\n" +
    "\n" +
    "Section 1 -- Definitions.\n" +
    "\n" +
    "  a. Adapted Material means material subject to Copyright and Similar\n" +
    "     Rights that is derived from or based upon the Licensed Material\n" +
    "     and in which the Licensed Material is translated, altered,\n" +
    "     arranged, transformed, or otherwise modified in a manner requiring\n" +
    "     permission under the Copyright and Similar Rights held by the\n" +
    "     Licensor. For purposes of this Public License, where the Licensed\n" +
    "     Material is a musical work, performance, or sound recording,\n" +
    "     Adapted Material is always produced where the Licensed Material is\n" +
    "     synched in timed relation with a moving image.\n" +
    "\n" +
    "  b. Adapter's License means the license You apply to Your Copyright\n" +
    "     and Similar Rights in Your contributions to Adapted Material in\n" +
    "     accordance with the terms and conditions of this Public License.\n" +
    "\n" +
    "  c. Copyright and Similar Rights means copyright and/or similar rights\n" +
    "     closely related to copyright including, without limitation,\n" +
    "     performance, broadcast, sound recording, and Sui Generis Database\n" +
    "     Rights, without regard to how the rights are labeled or\n" +
    "     categorized. For purposes of this Public License, the rights\n" +
    "     specified in Section 2(b)(1)-(2) are not Copyright and Similar\n" +
    "     Rights.\n" +
    "\n" +
    "  d. Effective Technological Measures means those measures that, in the\n" +
    "     absence of proper authority, may not be circumvented under laws\n" +
    "     fulfilling obligations under Article 11 of the WIPO Copyright\n" +
    "     Treaty adopted on December 20, 1996, and/or similar international\n" +
    "     agreements.\n" +
    "\n" +
    "  e. Exceptions and Limitations means fair use, fair dealing, and/or\n" +
    "     any other exception or limitation to Copyright and Similar Rights\n" +
    "     that applies to Your use of the Licensed Material.\n" +
    "\n" +
    "  f. Licensed Material means the artistic or literary work, database,\n" +
    "     or other material to which the Licensor applied this Public\n" +
    "     License.\n" +
    "\n" +
    "  g. Licensed Rights means the rights granted to You subject to the\n" +
    "     terms and conditions of this Public License, which are limited to\n" +
    "     all Copyright and Similar Rights that apply to Your use of the\n" +
    "     Licensed Material and that the Licensor has authority to license.\n" +
    "\n" +
    "  h. Licensor means the individual(s) or entity(ies) granting rights\n" +
    "     under this Public License.\n" +
    "\n" +
    "  i. Share means to provide material to the public by any means or\n" +
    "     process that requires permission under the Licensed Rights, such\n" +
    "     as reproduction, public display, public performance, distribution,\n" +
    "     dissemination, communication, or importation, and to make material\n" +
    "     available to the public including in ways that members of the\n" +
    "     public may access the material from a place and at a time\n" +
    "     individually chosen by them.\n" +
    "\n" +
    "  j. Sui Generis Database Rights means rights other than copyright\n" +
    "     resulting from Directive 96/9/EC of the European Parliament and of\n" +
    "     the Council of 11 March 1996 on the legal protection of databases,\n" +
    "     as amended and/or succeeded, as well as other essentially\n" +
    "     equivalent rights anywhere in the world.\n" +
    "\n" +
    "  k. You means the individual or entity exercising the Licensed Rights\n" +
    "     under this Public License. Your has a corresponding meaning.\n" +
    "\n" +
    "\n" +
    "Section 2 -- Scope.\n" +
    "\n" +
    "  a. License grant.\n" +
    "\n" +
    "       1. Subject to the terms and conditions of this Public License,\n" +
    "          the Licensor hereby grants You a worldwide, royalty-free,\n" +
    "          non-sublicensable, non-exclusive, irrevocable license to\n" +
    "          exercise the Licensed Rights in the Licensed Material to:\n" +
    "\n" +
    "            a. reproduce and Share the Licensed Material, in whole or\n" +
    "               in part; and\n" +
    "\n" +
    "            b. produce, reproduce, and Share Adapted Material.\n" +
    "\n" +
    "       2. Exceptions and Limitations. For the avoidance of doubt, where\n" +
    "          Exceptions and Limitations apply to Your use, this Public\n" +
    "          License does not apply, and You do not need to comply with\n" +
    "          its terms and conditions.\n" +
    "\n" +
    "       3. Term. The term of this Public License is specified in Section\n" +
    "          6(a).\n" +
    "\n" +
    "       4. Media and formats; technical modifications allowed. The\n" +
    "          Licensor authorizes You to exercise the Licensed Rights in\n" +
    "          all media and formats whether now known or hereafter created,\n" +
    "          and to make technical modifications necessary to do so. The\n" +
    "          Licensor waives and/or agrees not to assert any right or\n" +
    "          authority to forbid You from making technical modifications\n" +
    "          necessary to exercise the Licensed Rights, including\n" +
    "          technical modifications necessary to circumvent Effective\n" +
    "          Technological Measures. For purposes of this Public License,\n" +
    "          simply making modifications authorized by this Section 2(a)\n" +
    "          (4) never produces Adapted Material.\n" +
    "\n" +
    "       5. Downstream recipients.\n" +
    "            a. Offer from the Licensor -- Licensed Material. Every\n" +
    "               recipient of the Licensed Material automatically\n" +
    "               receives an offer from the Licensor to exercise the\n" +
    "               Licensed Rights under the terms and conditions of this\n" +
    "               Public License.\n" +
    "\n" +
    "            b. No downstream restrictions. You may not offer or impose\n" +
    "               any additional or different terms or conditions on, or\n" +
    "               apply any Effective Technological Measures to, the\n" +
    "               Licensed Material if doing so restricts exercise of the\n" +
    "               Licensed Rights by any recipient of the Licensed\n" +
    "               Material.\n" +
    "\n" +
    "       6. No endorsement. Nothing in this Public License constitutes or\n" +
    "          may be construed as permission to assert or imply that You\n" +
    "          are, or that Your use of the Licensed Material is, connected\n" +
    "          with, or sponsored, endorsed, or granted official status by,\n" +
    "          the Licensor or others designated to receive attribution as\n" +
    "          provided in Section 3(a)(1)(A)(i).\n" +
    "\n" +
    "  b. Other rights.\n" +
    "\n" +
    "       1. Moral rights, such as the right of integrity, are not\n" +
    "          licensed under this Public License, nor are publicity,\n" +
    "          privacy, and/or other similar personality rights; however, to\n" +
    "          the extent possible, the Licensor waives and/or agrees not to\n" +
    "          assert any such rights held by the Licensor to the limited\n" +
    "          extent necessary to allow You to exercise the Licensed\n" +
    "          Rights, but not otherwise.\n" +
    "\n" +
    "       2. Patent and trademark rights are not licensed under this\n" +
    "          Public License.\n" +
    "\n" +
    "       3. To the extent possible, the Licensor waives any right to\n" +
    "          collect royalties from You for the exercise of the Licensed\n" +
    "          Rights, whether directly or through a collecting society\n" +
    "          under any voluntary or waivable statutory or compulsory\n" +
    "          licensing scheme. In all other cases the Licensor expressly\n" +
    "          reserves any right to collect such royalties.\n" +
    "\n" +
    "\n" +
    "Section 3 -- License Conditions.\n" +
    "\n" +
    "Your exercise of the Licensed Rights is expressly made subject to the\n" +
    "following conditions.\n" +
    "\n" +
    "  a. Attribution.\n" +
    "\n" +
    "       1. If You Share the Licensed Material (including in modified\n" +
    "          form), You must:\n" +
    "\n" +
    "            a. retain the following if it is supplied by the Licensor\n" +
    "               with the Licensed Material:\n" +
    "\n" +
    "                 i. identification of the creator(s) of the Licensed\n" +
    "                    Material and any others designated to receive\n" +
    "                    attribution, in any reasonable manner requested by\n" +
    "                    the Licensor (including by pseudonym if\n" +
    "                    designated);\n" +
    "                ii. a copyright notice;\n" +
    "\n" +
    "               iii. a notice that refers to this Public License;\n" +
    "\n" +
    "                iv. a notice that refers to the disclaimer of\n" +
    "                    warranties;\n" +
    "\n" +
    "                 v. a URI or hyperlink to the Licensed Material to the\n" +
    "                    extent reasonably practicable;\n" +
    "\n" +
    "            b. indicate if You modified the Licensed Material and\n" +
    "               retain an indication of any previous modifications; and\n" +
    "\n" +
    "            c. indicate the Licensed Material is licensed under this\n" +
    "               Public License, and include the text of, or the URI or\n" +
    "               hyperlink to, this Public License.\n" +
    "\n" +
    "       2. You may satisfy the conditions in Section 3(a)(1) in any\n" +
    "          reasonable manner based on the medium, means, and context in\n" +
    "          which You Share the Licensed Material. For example, it may be\n" +
    "          reasonable to satisfy the conditions by providing a URI or\n" +
    "          hyperlink to a resource that includes the required\n" +
    "          information.\n" +
    "\n" +
    "       3. If requested by the Licensor, You must remove any of the\n" +
    "          information required by Section 3(a)(1)(A) to the extent\n" +
    "          reasonably practicable.\n" +
    "\n" +
    "       4. If You Share Adapted Material You produce, the Adapter's\n" +
    "          License You apply must not prevent recipients of the Adapted\n" +
    "          Material from complying with this Public License.\n" +
    "\n" +
    "\n" +
    "Section 4 -- Sui Generis Database Rights.\n" +
    "\n" +
    "Where the Licensed Rights include Sui Generis Database Rights that\n" +
    "apply to Your use of the Licensed Material:\n" +
    "\n" +
    "  a. for the avoidance of doubt, Section 2(a)(1) grants You the right\n" +
    "     to extract, reuse, reproduce, and Share all or a substantial\n" +
    "     portion of the contents of the database;\n" +
    "\n" +
    "  b. if You include all or a substantial portion of the database\n" +
    "     contents in a database in which You have Sui Generis Database\n" +
    "     Rights, then the database in which You have Sui Generis Database\n" +
    "     Rights (but not its individual contents) is Adapted Material; and\n" +
    "\n" +
    "  c. You must comply with the conditions in Section 3(a) if You Share\n" +
    "     all or a substantial portion of the contents of the database.\n" +
    "\n" +
    "For the avoidance of doubt, this Section 4 supplements and does not\n" +
    "replace Your obligations under this Public License where the Licensed\n" +
    "Rights include other Copyright and Similar Rights.\n" +
    "\n" +
    "\n" +
    "Section 5 -- Disclaimer of Warranties and Limitation of Liability.\n" +
    "\n" +
    "  a. UNLESS OTHERWISE SEPARATELY UNDERTAKEN BY THE LICENSOR, TO THE\n" +
    "     EXTENT POSSIBLE, THE LICENSOR OFFERS THE LICENSED MATERIAL AS-IS\n" +
    "     AND AS-AVAILABLE, AND MAKES NO REPRESENTATIONS OR WARRANTIES OF\n" +
    "     ANY KIND CONCERNING THE LICENSED MATERIAL, WHETHER EXPRESS,\n" +
    "     IMPLIED, STATUTORY, OR OTHER. THIS INCLUDES, WITHOUT LIMITATION,\n" +
    "     WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS FOR A PARTICULAR\n" +
    "     PURPOSE, NON-INFRINGEMENT, ABSENCE OF LATENT OR OTHER DEFECTS,\n" +
    "     ACCURACY, OR THE PRESENCE OR ABSENCE OF ERRORS, WHETHER OR NOT\n" +
    "     KNOWN OR DISCOVERABLE. WHERE DISCLAIMERS OF WARRANTIES ARE NOT\n" +
    "     ALLOWED IN FULL OR IN PART, THIS DISCLAIMER MAY NOT APPLY TO YOU.\n" +
    "\n" +
    "  b. TO THE EXTENT POSSIBLE, IN NO EVENT WILL THE LICENSOR BE LIABLE\n" +
    "     TO YOU ON ANY LEGAL THEORY (INCLUDING, WITHOUT LIMITATION,\n" +
    "     NEGLIGENCE) OR OTHERWISE FOR ANY DIRECT, SPECIAL, INDIRECT,\n" +
    "     INCIDENTAL, CONSEQUENTIAL, PUNITIVE, EXEMPLARY, OR OTHER LOSSES,\n" +
    "     COSTS, EXPENSES, OR DAMAGES ARISING OUT OF THIS PUBLIC LICENSE OR\n" +
    "     USE OF THE LICENSED MATERIAL, EVEN IF THE LICENSOR HAS BEEN\n" +
    "     ADVISED OF THE POSSIBILITY OF SUCH LOSSES, COSTS, EXPENSES, OR\n" +
    "     DAMAGES. WHERE A LIMITATION OF LIABILITY IS NOT ALLOWED IN FULL OR\n" +
    "     IN PART, THIS LIMITATION MAY NOT APPLY TO YOU.\n" +
    "\n" +
    "  c. The disclaimer of warranties and limitation of liability provided\n" +
    "     above shall be interpreted in a manner that, to the extent\n" +
    "     possible, most closely approximates an absolute disclaimer and\n" +
    "     waiver of all liability.\n" +
    "\n" +
    "\n" +
    "Section 6 -- Term and Termination.\n" +
    "\n" +
    "  a. This Public License applies for the term of the Copyright and\n" +
    "     Similar Rights licensed here. However, if You fail to comply with\n" +
    "     this Public License, then Your rights under this Public License\n" +
    "     terminate automatically.\n" +
    "\n" +
    "  b. Where Your right to use the Licensed Material has terminated under\n" +
    "     Section 6(a), it reinstates:\n" +
    "\n" +
    "       1. automatically as of the date the violation is cured, provided\n" +
    "          it is cured within 30 days of Your discovery of the\n" +
    "          violation; or\n" +
    "\n" +
    "       2. upon express reinstatement by the Licensor.\n" +
    "\n" +
    "     For the avoidance of doubt, this Section 6(b) does not affect any\n" +
    "     right the Licensor may have to seek remedies for Your violations\n" +
    "     of this Public License.\n" +
    "\n" +
    "  c. For the avoidance of doubt, the Licensor may also offer the\n" +
    "     Licensed Material under separate terms or conditions or stop\n" +
    "     distributing the Licensed Material at any time; however, doing so\n" +
    "     will not terminate this Public License.\n" +
    "\n" +
    "  d. Sections 1, 5, 6, 7, and 8 survive termination of this Public\n" +
    "     License.\n" +
    "\n" +
    "\n" +
    "Section 7 -- Other Terms and Conditions.\n" +
    "\n" +
    "  a. The Licensor shall not be bound by any additional or different\n" +
    "     terms or conditions communicated by You unless expressly agreed.\n" +
    "\n" +
    "  b. Any arrangements, understandings, or agreements regarding the\n" +
    "     Licensed Material not stated herein are separate from and\n" +
    "     independent of the terms and conditions of this Public License.\n" +
    "\n" +
    "\n" +
    "Section 8 -- Interpretation.\n" +
    "\n" +
    "  a. For the avoidance of doubt, this Public License does not, and\n" +
    "     shall not be interpreted to, reduce, limit, restrict, or impose\n" +
    "     conditions on any use of the Licensed Material that could lawfully\n" +
    "     be made without permission under this Public License.\n" +
    "\n" +
    "  b. To the extent possible, if any provision of this Public License is\n" +
    "     deemed unenforceable, it shall be automatically reformed to the\n" +
    "     minimum extent necessary to make it enforceable. If the provision\n" +
    "     cannot be reformed, it shall be severed from this Public License\n" +
    "     without affecting the enforceability of the remaining terms and\n" +
    "     conditions.\n" +
    "\n" +
    "  c. No term or condition of this Public License will be waived and no\n" +
    "     failure to comply consented to unless expressly agreed to by the\n" +
    "     Licensor.\n" +
    "\n" +
    "  d. Nothing in this Public License constitutes or may be interpreted\n" +
    "     as a limitation upon, or waiver of, any privileges and immunities\n" +
    "     that apply to the Licensor or You, including from the legal\n" +
    "     processes of any jurisdiction or authority.\n" +
    "\n" +
    "\n" +
    "=======================================================================\n" +
    "\n" +
    "Creative Commons is not a party to its public licenses.\n" +
    "Notwithstanding, Creative Commons may elect to apply one of its public\n" +
    "licenses to material it publishes and in those instances will be\n" +
    "considered the \"Licensor.\" Except for the limited purpose of indicating\n" +
    "that material is shared under a Creative Commons public license or as\n" +
    "otherwise permitted by the Creative Commons policies published at\n" +
    "creativecommons.org/policies, Creative Commons does not authorize the\n" +
    "use of the trademark \"Creative Commons\" or any other trademark or logo\n" +
    "of Creative Commons without its prior written consent including,\n" +
    "without limitation, in connection with any unauthorized modifications\n" +
    "to any of its public licenses or any other arrangements,\n" +
    "understandings, or agreements concerning use of licensed material. For\n" +
    "the avoidance of doubt, this paragraph does not form part of the public\n" +
    "licenses.\n" +
    "\n" +
    "Creative Commons may be contacted at creativecommons.org.\n";


const LICENSE_GENERAL =
    "Android Material Icon Generator License\n" +
    "================================\n" +
    "\n" +
    "Icons generated with the Android Material Icon Generator come with the Creative Common\n" +
    "Attribution 4.0 International License (CC-BY 4.0). You are free to change,\n" +
    "combine and sell any of the icons as you please. Attribution would be great,\n" +
    "but is not strictly required.\n" +
    "\n" +
    "This text only applies to the icons (.zip file) you download from the icon\n" +
    "generator. The software behind the generator has its own license\n" +
    "(https://www.apache.org/licenses/LICENSE-2.0). See the GitHub repository for\n" +
    "details (https://github.com/Maddoc42/Android-Material-Icon-Generator).\n" +
    "\n" +
    "\n" +
    "\n" +
    "Google Material Icons License\n" +
    "=============================\n" +
    "\n" +
    "(Copied from https://github.com/google/material-design-icons)\n" +
    "We have made these icons available for you to incorporate them into your\n" +
    "products under the Creative Common Attribution 4.0 International License (CC-BY\n" +
    "4.0, https://creativecommons.org/licenses/by/4.0/). Feel free to remix and\n" +
    "re-share these icons and documentation in your products.  We'd love attribution\n" +
    "in your app's *about* screen, but it's not required.  The only thing we ask is\n" +
    "that you not re-sell the icons themselves.";


module.exports = {
    LICENSE_CC_BY_4: LICENSE_CC_BY_4,
    LICENSE_GENERAL: LICENSE_GENERAL
};

