import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useState } from 'react';

import { IAiDisplayerProps } from './AiDisplayer.config';

const AiDisplayer: FC<IAiDisplayerProps> = ({ style, className, classNames = [] }) => {
  const { connect } = useRenderer();
  const [value, setValue] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    sources: { datasource: ds },
  } = useSources();

  type AIResponse =
    | { datatype: 'string'; content: string }
    | { datatype: 'image'; content: string }
    | { datatype: 'table'; content: any }
    | { datatype: 'svg'; content: any };

  useEffect(() => {
    if (!ds) return;

    const listener = async (/* event */) => {
      const v = await ds.getValue<AIResponse>();
      if (!v) return;
      setValue(JSON.parse(v as any));
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds]);

  useEffect(() => {
    if (value?.datatype === 'table') {
      if (!value.content || value.content.length === 0) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [value]);

  //to render a table
  const renderList = (output: any) => {
    if (loading) {
      return (
        <div className="p-2">
          <span>{output.query}</span>
          <span className="italic">Loading...</span>
        </div>
      );
    }
    if (!output.content || !output.content.length)
      return (
        <div className="p-2 flex flex-col">
          <span>No data!</span>
        </div>
      );
    const headers = Object.keys(output.content[0]); //column names
    return (
      <div style={{ maxHeight: "550px"}} className="datatable w-full overflow-y-auto overflow-x-auto shadow-md rounded-lg border border-gray-200 bg-white">
        <div className="italic p-2 flex flex-col">
          <span>Query: {output.query}</span>
          <span>Data length: {output.content.length}</span>
        </div>

        <table className=" table-auto min-w-full text-sm text-gray-700">
          <thead className="sticky top-0 bg-gray-100 text-gray-900">
            <tr>
              {headers.map((header) => (
                <th
                  className="px-4 py-4 font-semibold text-center border-b border-gray-300"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.content.map((row: any, rowIndex: any) => (
              <tr key={rowIndex}>
                {headers.map((header) => (
                  <td className="px-4 py-2 text-center border border-gray-200" key={header}>
                    {/* {console.log(typeof row[header])} */}
                    {typeof row[header] === 'object' ? JSON.stringify(row[header]) : row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch ((value as any).datatype) {
      case 'string':
        return (
          <div className="p-3 border border-gray-300 rounded-lg bg-white text-gray-800 min-h-fit h-fit">
            {(value as any).content}
          </div>
        );
      case 'image':
        return (
          <img
            className="w-[500px] rounded-lg h-full shadow"
            src={(value as any).content}
            alt="AI generated"
          />
        );
      case 'table':
        return <>{renderList(value as any)}</>;
      case 'svg':
        return <div style={{ maxHeight: "550px"}} dangerouslySetInnerHTML={{ __html: (value as any).content }} />;
      default:
        return <span>Unsupported response type</span>;
    }
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      {value ? renderContent() : 'Waiting for response...'}
    </div>
  );
};

export default AiDisplayer;
